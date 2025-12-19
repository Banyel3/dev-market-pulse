"""Run scrapers to collect job data."""

import asyncio
import logging
from sqlmodel import Session

from app.database import engine
from app.scrapers import IndeedScraper, RemoteOKScraper

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def run_indeed_scraper(session: Session, query: str = "software engineer", limit: int = 30):
    """Run Indeed scraper."""
    logger.info(f"Starting Indeed scraper for '{query}'")
    scraper = IndeedScraper(session)
    
    jobs = await scraper.scrape(search_query=query, limit=limit)
    logger.info(f"Found {len(jobs)} jobs from Indeed")
    
    # Save jobs to database
    saved_count = 0
    for job_data in jobs:
        if scraper.save_job(job_data):
            saved_count += 1
    
    logger.info(f"Saved {saved_count} new jobs from Indeed")
    return saved_count


async def run_remoteok_scraper(session: Session, limit: int = 50):
    """Run RemoteOK scraper."""
    logger.info("Starting RemoteOK scraper")
    scraper = RemoteOKScraper(session)
    
    jobs = await scraper.scrape(limit=limit)
    logger.info(f"Found {len(jobs)} jobs from RemoteOK")
    
    # Save jobs to database
    saved_count = 0
    for job_data in jobs:
        if scraper.save_job(job_data):
            saved_count += 1
    
    logger.info(f"Saved {saved_count} new jobs from RemoteOK")
    return saved_count


async def run_all_scrapers():
    """Run all scrapers."""
    session = Session(engine)
    
    try:
        logger.info("=" * 60)
        logger.info("Starting job scraping process")
        logger.info("=" * 60)
        
        total_saved = 0
        
        # Run RemoteOK scraper (API-based, faster and more reliable)
        logger.info("\n[1/2] Running RemoteOK scraper...")
        remoteok_count = await run_remoteok_scraper(session, limit=50)
        total_saved += remoteok_count
        
        # Run Indeed scraper
        logger.info("\n[2/2] Running Indeed scraper...")
        indeed_count = await run_indeed_scraper(session, query="software engineer", limit=30)
        total_saved += indeed_count
        
        # You can add more search queries for Indeed
        logger.info("\nSearching for Python developers...")
        python_count = await run_indeed_scraper(session, query="python developer", limit=20)
        total_saved += python_count
        
        logger.info("\nSearching for Frontend developers...")
        frontend_count = await run_indeed_scraper(session, query="frontend developer", limit=20)
        total_saved += frontend_count
        
        logger.info("=" * 60)
        logger.info(f"✅ Scraping complete! Total new jobs saved: {total_saved}")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
        session.rollback()
    finally:
        session.close()


if __name__ == "__main__":
    asyncio.run(run_all_scrapers())
