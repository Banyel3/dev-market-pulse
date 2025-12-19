"""Celery tasks for job scraping and data aggregation."""

import asyncio
import logging
from datetime import datetime, timedelta, date
from typing import Dict, Any
from sqlmodel import Session, select, func, and_

from app.celery_app import celery_app
from app.database import engine
from app.models import (
    JobPosting, Skill, Company, Location, JobSkillLink,
    DailySkillStats, DailyLocationStats, DailyCompanyStats, DailyGlobalStats
)
from app.scrapers import IndeedScraper, RemoteOKScraper

logger = logging.getLogger(__name__)


@celery_app.task(name='app.tasks.scrape_jobs_task', bind=True, max_retries=3)
def scrape_jobs_task(self) -> Dict[str, Any]:
    """
    Scrape jobs from all configured sources.
    Runs daily at midnight.
    """
    logger.info("Starting daily job scraping task")
    
    try:
        # Run the async scraping function
        total_saved = asyncio.run(run_all_scrapers())
        
        logger.info(f"✅ Daily scraping complete. Saved {total_saved} new jobs")
        
        return {
            'status': 'success',
            'jobs_saved': total_saved,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in scraping task: {str(e)}")
        # Retry the task
        raise self.retry(exc=e, countdown=300)  # Retry after 5 minutes


async def run_all_scrapers() -> int:
    """Run all scrapers and return total jobs saved."""
    session = Session(engine)
    total_saved = 0
    
    try:
        # RemoteOK scraper
        logger.info("Running RemoteOK scraper...")
        remoteok_scraper = RemoteOKScraper(session)
        remoteok_jobs = await remoteok_scraper.scrape(limit=50)
        for job_data in remoteok_jobs:
            if remoteok_scraper.save_job(job_data):
                total_saved += 1
        
        # Indeed scrapers with different queries
        queries = ["software engineer", "python developer", "frontend developer", "backend developer"]
        
        for query in queries:
            logger.info(f"Running Indeed scraper for '{query}'...")
            indeed_scraper = IndeedScraper(session)
            indeed_jobs = await indeed_scraper.scrape(search_query=query, limit=20)
            for job_data in indeed_jobs:
                if indeed_scraper.save_job(job_data):
                    total_saved += 1
        
        return total_saved
        
    finally:
        session.close()


@celery_app.task(name='app.tasks.aggregate_daily_stats_task', bind=True)
def aggregate_daily_stats_task(self, target_date: str = None) -> Dict[str, Any]:
    """
    Aggregate daily statistics for skills, companies, locations, and global metrics.
    Runs daily at 1 AM (after scraping).
    """
    logger.info("Starting daily statistics aggregation task")
    
    try:
        if target_date:
            stats_date = datetime.fromisoformat(target_date).date()
        else:
            # Aggregate stats for yesterday
            stats_date = (datetime.utcnow() - timedelta(days=1)).date()
        
        session = Session(engine)
        
        # Aggregate skill stats
        skill_count = aggregate_skill_stats(session, stats_date)
        
        # Aggregate location stats
        location_count = aggregate_location_stats(session, stats_date)
        
        # Aggregate company stats
        company_count = aggregate_company_stats(session, stats_date)
        
        # Aggregate global stats
        aggregate_global_stats(session, stats_date)
        
        session.close()
        
        logger.info(f"✅ Daily stats aggregation complete for {stats_date}")
        logger.info(f"   - Skills: {skill_count}")
        logger.info(f"   - Locations: {location_count}")
        logger.info(f"   - Companies: {company_count}")
        
        return {
            'status': 'success',
            'date': stats_date.isoformat(),
            'skills_aggregated': skill_count,
            'locations_aggregated': location_count,
            'companies_aggregated': company_count,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in aggregation task: {str(e)}")
        raise self.retry(exc=e, countdown=300)


def aggregate_skill_stats(session: Session, stats_date: date) -> int:
    """Aggregate daily statistics for each skill."""
    count = 0
    
    # Get all active skills
    skills = session.exec(select(Skill).where(Skill.is_active == True)).all()
    
    for skill in skills:
        # Check if stats already exist
        existing = session.exec(
            select(DailySkillStats).where(
                and_(
                    DailySkillStats.skill_id == skill.id,
                    DailySkillStats.date == stats_date
                )
            )
        ).first()
        
        if existing:
            continue
        
        # Count jobs for this skill
        job_count = session.exec(
            select(func.count(JobSkillLink.job_id)).where(
                JobSkillLink.skill_id == skill.id
            ).join(JobPosting, JobPosting.id == JobSkillLink.job_id).where(
                JobPosting.is_active == True
            )
        ).one() or 0
        
        if job_count == 0:
            continue
        
        # Count unique companies
        unique_companies = session.exec(
            select(func.count(func.distinct(JobPosting.company_id))).where(
                JobPosting.id.in_(
                    select(JobSkillLink.job_id).where(JobSkillLink.skill_id == skill.id)
                ),
                JobPosting.is_active == True
            )
        ).one() or 0
        
        # Count unique locations
        unique_locations = session.exec(
            select(func.count(func.distinct(JobPosting.location_id))).where(
                JobPosting.id.in_(
                    select(JobSkillLink.job_id).where(JobSkillLink.skill_id == skill.id)
                ),
                JobPosting.is_active == True
            )
        ).one() or 0
        
        # Calculate median salary
        salaries = session.exec(
            select(JobPosting.salary_max).where(
                JobPosting.id.in_(
                    select(JobSkillLink.job_id).where(JobSkillLink.skill_id == skill.id)
                ),
                JobPosting.salary_max.isnot(None),
                JobPosting.is_active == True
            )
        ).all()
        
        median_salary = None
        if salaries:
            sorted_salaries = sorted(salaries)
            mid = len(sorted_salaries) // 2
            median_salary = sorted_salaries[mid]
        
        # Calculate growth rates (7d and 30d)
        growth_7d = calculate_growth_rate(session, skill.id, stats_date, 7)
        growth_30d = calculate_growth_rate(session, skill.id, stats_date, 30)
        
        # Create daily stat
        daily_stat = DailySkillStats(
            skill_id=skill.id,
            date=stats_date,
            job_count=job_count,
            unique_companies=unique_companies,
            unique_locations=unique_locations,
            median_salary=median_salary,
            growth_rate_7d=growth_7d,
            growth_rate_30d=growth_30d,
            created_at=datetime.utcnow()
        )
        
        session.add(daily_stat)
        count += 1
    
    session.commit()
    return count


def calculate_growth_rate(session: Session, skill_id: int, current_date: date, days: int) -> float:
    """Calculate growth rate for a skill over the specified period."""
    past_date = current_date - timedelta(days=days)
    
    # Get past stat
    past_stat = session.exec(
        select(DailySkillStats).where(
            and_(
                DailySkillStats.skill_id == skill_id,
                DailySkillStats.date == past_date
            )
        )
    ).first()
    
    # Get current count
    current_count = session.exec(
        select(func.count(JobSkillLink.job_id)).where(
            JobSkillLink.skill_id == skill_id
        ).join(JobPosting, JobPosting.id == JobSkillLink.job_id).where(
            JobPosting.is_active == True
        )
    ).one() or 0
    
    if not past_stat or past_stat.job_count == 0:
        return 0.0
    
    # Calculate percentage change
    growth = ((current_count - past_stat.job_count) / past_stat.job_count) * 100
    return round(growth, 2)


def aggregate_location_stats(session: Session, stats_date: date) -> int:
    """Aggregate daily statistics for each location."""
    count = 0
    
    locations = session.exec(select(Location)).all()
    
    for location in locations:
        # Check if stats already exist
        existing = session.exec(
            select(DailyLocationStats).where(
                and_(
                    DailyLocationStats.location_id == location.id,
                    DailyLocationStats.date == stats_date
                )
            )
        ).first()
        
        if existing:
            continue
        
        # Count active jobs
        job_count = session.exec(
            select(func.count(JobPosting.id)).where(
                JobPosting.location_id == location.id,
                JobPosting.is_active == True
            )
        ).one() or 0
        
        if job_count == 0:
            continue
        
        # Calculate average salary
        avg_salary = session.exec(
            select(func.avg(JobPosting.salary_max)).where(
                JobPosting.location_id == location.id,
                JobPosting.salary_max.isnot(None),
                JobPosting.is_active == True
            )
        ).first()
        
        daily_stat = DailyLocationStats(
            location_id=location.id,
            date=stats_date,
            job_count=job_count,
            avg_salary=avg_salary,
            created_at=datetime.utcnow()
        )
        
        session.add(daily_stat)
        count += 1
    
    session.commit()
    return count


def aggregate_company_stats(session: Session, stats_date: date) -> int:
    """Aggregate daily statistics for each company."""
    count = 0
    
    companies = session.exec(select(Company)).all()
    
    for company in companies:
        # Check if stats already exist
        existing = session.exec(
            select(DailyCompanyStats).where(
                and_(
                    DailyCompanyStats.company_id == company.id,
                    DailyCompanyStats.date == stats_date
                )
            )
        ).first()
        
        if existing:
            continue
        
        # Count active jobs
        job_count = session.exec(
            select(func.count(JobPosting.id)).where(
                JobPosting.company_id == company.id,
                JobPosting.is_active == True
            )
        ).one() or 0
        
        if job_count == 0:
            continue
        
        daily_stat = DailyCompanyStats(
            company_id=company.id,
            date=stats_date,
            job_count=job_count,
            created_at=datetime.utcnow()
        )
        
        session.add(daily_stat)
        count += 1
    
    session.commit()
    return count


def aggregate_global_stats(session: Session, stats_date: date):
    """Aggregate global daily statistics."""
    # Check if stats already exist
    existing = session.exec(
        select(DailyGlobalStats).where(DailyGlobalStats.date == stats_date)
    ).first()
    
    if existing:
        return
    
    # Count totals
    total_jobs = session.exec(
        select(func.count(JobPosting.id)).where(JobPosting.is_active == True)
    ).one() or 0
    
    unique_skills = session.exec(
        select(func.count(func.distinct(JobSkillLink.skill_id)))
    ).one() or 0
    
    unique_companies = session.exec(
        select(func.count(func.distinct(JobPosting.company_id))).where(
            JobPosting.is_active == True
        )
    ).one() or 0
    
    unique_locations = session.exec(
        select(func.count(func.distinct(JobPosting.location_id))).where(
            JobPosting.is_active == True
        )
    ).one() or 0
    
    daily_stat = DailyGlobalStats(
        date=stats_date,
        total_jobs=total_jobs,
        unique_skills=unique_skills,
        unique_companies=unique_companies,
        unique_locations=unique_locations,
        created_at=datetime.utcnow()
    )
    
    session.add(daily_stat)
    session.commit()


@celery_app.task(name='app.tasks.cleanup_old_jobs_task')
def cleanup_old_jobs_task() -> Dict[str, Any]:
    """
    Mark old job postings as inactive.
    Runs daily at 2 AM.
    """
    logger.info("Starting old jobs cleanup task")
    
    try:
        session = Session(engine)
        
        # Mark jobs older than 60 days as inactive
        cutoff_date = datetime.utcnow() - timedelta(days=60)
        
        result = session.exec(
            select(JobPosting).where(
                JobPosting.created_at < cutoff_date,
                JobPosting.is_active == True
            )
        ).all()
        
        count = 0
        for job in result:
            job.is_active = False
            count += 1
        
        session.commit()
        session.close()
        
        logger.info(f"✅ Marked {count} old jobs as inactive")
        
        return {
            'status': 'success',
            'jobs_deactivated': count,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in cleanup task: {str(e)}")
        return {'status': 'error', 'message': str(e)}


# Manual trigger tasks
@celery_app.task(name='app.tasks.trigger_scraping_now')
def trigger_scraping_now():
    """Manually trigger scraping (for testing or manual runs)."""
    return scrape_jobs_task()


@celery_app.task(name='app.tasks.trigger_aggregation_now')
def trigger_aggregation_now(target_date: str = None):
    """Manually trigger stats aggregation (for testing or backfilling)."""
    return aggregate_daily_stats_task(target_date)
