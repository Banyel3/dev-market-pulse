"""
Seed script to populate the database with realistic mock data.
Run with: python -m app.seed
"""

from datetime import datetime, timedelta, date
import random
from sqlmodel import Session

from app.database import engine, init_db
from app.models import (
    Location, Company, Skill, JobPosting, SourceConfig,
    DailyGlobalStats, DailySkillStats, DailyLocationStats,
    JobSkillLink, SkillCategory, EmploymentType, SeniorityLevel, RemoteType
)


def seed_locations(session: Session) -> list[Location]:
    """Seed location data."""
    locations_data = [
        {"city": "San Francisco", "region": "California", "country": "USA", "country_code": "US", "region_group": "Americas", "latitude": 37.7749, "longitude": -122.4194},
        {"city": "New York", "region": "New York", "country": "USA", "country_code": "US", "region_group": "Americas", "latitude": 40.7128, "longitude": -74.0060},
        {"city": "Seattle", "region": "Washington", "country": "USA", "country_code": "US", "region_group": "Americas", "latitude": 47.6062, "longitude": -122.3321},
        {"city": "Austin", "region": "Texas", "country": "USA", "country_code": "US", "region_group": "Americas", "latitude": 30.2672, "longitude": -97.7431},
        {"city": "Boston", "region": "Massachusetts", "country": "USA", "country_code": "US", "region_group": "Americas", "latitude": 42.3601, "longitude": -71.0589},
        {"city": "London", "region": "England", "country": "UK", "country_code": "GB", "region_group": "EMEA", "latitude": 51.5074, "longitude": -0.1278},
        {"city": "Berlin", "region": "Berlin", "country": "Germany", "country_code": "DE", "region_group": "EMEA", "latitude": 52.5200, "longitude": 13.4050},
        {"city": "Amsterdam", "region": "North Holland", "country": "Netherlands", "country_code": "NL", "region_group": "EMEA", "latitude": 52.3676, "longitude": 4.9041},
        {"city": "Paris", "region": "Île-de-France", "country": "France", "country_code": "FR", "region_group": "EMEA", "latitude": 48.8566, "longitude": 2.3522},
        {"city": "Dublin", "region": "Leinster", "country": "Ireland", "country_code": "IE", "region_group": "EMEA", "latitude": 53.3498, "longitude": -6.2603},
        {"city": "Singapore", "region": "Singapore", "country": "Singapore", "country_code": "SG", "region_group": "APAC", "latitude": 1.3521, "longitude": 103.8198},
        {"city": "Tokyo", "region": "Tokyo", "country": "Japan", "country_code": "JP", "region_group": "APAC", "latitude": 35.6762, "longitude": 139.6503},
        {"city": "Sydney", "region": "NSW", "country": "Australia", "country_code": "AU", "region_group": "APAC", "latitude": -33.8688, "longitude": 151.2093},
        {"city": "Toronto", "region": "Ontario", "country": "Canada", "country_code": "CA", "region_group": "Americas", "latitude": 43.6532, "longitude": -79.3832},
        {"city": "Remote", "region": "Global", "country": "Global", "country_code": "XX", "region_group": "Remote", "latitude": 0, "longitude": 0},
    ]
    
    locations = []
    for loc_data in locations_data:
        location = Location(**loc_data)
        session.add(location)
        locations.append(location)
    
    session.commit()
    for loc in locations:
        session.refresh(loc)
    return locations


def seed_companies(session: Session, locations: list[Location]) -> list[Company]:
    """Seed company data."""
    companies_data = [
        {"name": "Google", "website": "https://google.com", "domain": "google.com", "industry": "Tech", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/google.com"},
        {"name": "Amazon", "website": "https://amazon.com", "domain": "amazon.com", "industry": "E-commerce", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/amazon.com"},
        {"name": "Microsoft", "website": "https://microsoft.com", "domain": "microsoft.com", "industry": "Tech", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/microsoft.com"},
        {"name": "Meta", "website": "https://meta.com", "domain": "meta.com", "industry": "Tech", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/meta.com"},
        {"name": "Apple", "website": "https://apple.com", "domain": "apple.com", "industry": "Tech", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/apple.com"},
        {"name": "Netflix", "website": "https://netflix.com", "domain": "netflix.com", "industry": "Media", "size_bucket": "5001-10000", "logo_url": "https://logo.clearbit.com/netflix.com"},
        {"name": "Spotify", "website": "https://spotify.com", "domain": "spotify.com", "industry": "Media", "size_bucket": "5001-10000", "logo_url": "https://logo.clearbit.com/spotify.com"},
        {"name": "Uber", "website": "https://uber.com", "domain": "uber.com", "industry": "Transport", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/uber.com"},
        {"name": "Airbnb", "website": "https://airbnb.com", "domain": "airbnb.com", "industry": "Hospitality", "size_bucket": "5001-10000", "logo_url": "https://logo.clearbit.com/airbnb.com"},
        {"name": "Stripe", "website": "https://stripe.com", "domain": "stripe.com", "industry": "FinTech", "size_bucket": "1001-5000", "logo_url": "https://logo.clearbit.com/stripe.com"},
        {"name": "Shopify", "website": "https://shopify.com", "domain": "shopify.com", "industry": "E-commerce", "size_bucket": "5001-10000", "logo_url": "https://logo.clearbit.com/shopify.com"},
        {"name": "PayPal", "website": "https://paypal.com", "domain": "paypal.com", "industry": "FinTech", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/paypal.com"},
        {"name": "Salesforce", "website": "https://salesforce.com", "domain": "salesforce.com", "industry": "Enterprise", "size_bucket": "10000+", "logo_url": "https://logo.clearbit.com/salesforce.com"},
        {"name": "Datadog", "website": "https://datadoghq.com", "domain": "datadoghq.com", "industry": "DevOps", "size_bucket": "1001-5000", "logo_url": "https://logo.clearbit.com/datadoghq.com"},
        {"name": "Twilio", "website": "https://twilio.com", "domain": "twilio.com", "industry": "Communications", "size_bucket": "1001-5000", "logo_url": "https://logo.clearbit.com/twilio.com"},
        {"name": "Figma", "website": "https://figma.com", "domain": "figma.com", "industry": "Design", "size_bucket": "501-1000", "logo_url": "https://logo.clearbit.com/figma.com"},
        {"name": "Notion", "website": "https://notion.so", "domain": "notion.so", "industry": "Productivity", "size_bucket": "201-500", "logo_url": "https://logo.clearbit.com/notion.so"},
        {"name": "Linear", "website": "https://linear.app", "domain": "linear.app", "industry": "Productivity", "size_bucket": "51-200", "logo_url": "https://logo.clearbit.com/linear.app"},
        {"name": "Vercel", "website": "https://vercel.com", "domain": "vercel.com", "industry": "DevOps", "size_bucket": "201-500", "logo_url": "https://logo.clearbit.com/vercel.com"},
        {"name": "Supabase", "website": "https://supabase.com", "domain": "supabase.com", "industry": "Infrastructure", "size_bucket": "51-200", "logo_url": "https://logo.clearbit.com/supabase.com"},
    ]
    
    companies = []
    for comp_data in companies_data:
        comp_data["hq_location_id"] = random.choice(locations[:5]).id
        company = Company(**comp_data)
        session.add(company)
        companies.append(company)
    
    session.commit()
    for comp in companies:
        session.refresh(comp)
    return companies


def seed_skills(session: Session) -> list[Skill]:
    """Seed skill data."""
    skills_data = [
        # Languages
        {"name": "Python", "category": SkillCategory.LANGUAGE},
        {"name": "JavaScript", "category": SkillCategory.LANGUAGE},
        {"name": "TypeScript", "category": SkillCategory.LANGUAGE},
        {"name": "Java", "category": SkillCategory.LANGUAGE},
        {"name": "Go", "category": SkillCategory.LANGUAGE},
        {"name": "Rust", "category": SkillCategory.LANGUAGE},
        {"name": "C++", "category": SkillCategory.LANGUAGE},
        {"name": "C#", "category": SkillCategory.LANGUAGE},
        {"name": "Ruby", "category": SkillCategory.LANGUAGE},
        {"name": "Kotlin", "category": SkillCategory.LANGUAGE},
        {"name": "Swift", "category": SkillCategory.LANGUAGE},
        {"name": "PHP", "category": SkillCategory.LANGUAGE},
        
        # Frameworks
        {"name": "React", "category": SkillCategory.FRAMEWORK},
        {"name": "Vue.js", "category": SkillCategory.FRAMEWORK},
        {"name": "Angular", "category": SkillCategory.FRAMEWORK},
        {"name": "Node.js", "category": SkillCategory.FRAMEWORK},
        {"name": "Django", "category": SkillCategory.FRAMEWORK},
        {"name": "FastAPI", "category": SkillCategory.FRAMEWORK},
        {"name": "Spring Boot", "category": SkillCategory.FRAMEWORK},
        {"name": "Next.js", "category": SkillCategory.FRAMEWORK},
        {"name": "Express.js", "category": SkillCategory.FRAMEWORK},
        {"name": "Flask", "category": SkillCategory.FRAMEWORK},
        {"name": "Rails", "category": SkillCategory.FRAMEWORK},
        {"name": "Svelte", "category": SkillCategory.FRAMEWORK},
        
        # Tools
        {"name": "Docker", "category": SkillCategory.TOOL},
        {"name": "Kubernetes", "category": SkillCategory.TOOL},
        {"name": "Git", "category": SkillCategory.TOOL},
        {"name": "Jenkins", "category": SkillCategory.TOOL},
        {"name": "Terraform", "category": SkillCategory.TOOL},
        {"name": "Ansible", "category": SkillCategory.TOOL},
        {"name": "GraphQL", "category": SkillCategory.TOOL},
        {"name": "REST API", "category": SkillCategory.TOOL},
        
        # Cloud
        {"name": "AWS", "category": SkillCategory.CLOUD},
        {"name": "Azure", "category": SkillCategory.CLOUD},
        {"name": "GCP", "category": SkillCategory.CLOUD},
        {"name": "Vercel", "category": SkillCategory.CLOUD},
        {"name": "Cloudflare", "category": SkillCategory.CLOUD},
        
        # Databases
        {"name": "PostgreSQL", "category": SkillCategory.DATABASE},
        {"name": "MongoDB", "category": SkillCategory.DATABASE},
        {"name": "Redis", "category": SkillCategory.DATABASE},
        {"name": "MySQL", "category": SkillCategory.DATABASE},
        {"name": "Elasticsearch", "category": SkillCategory.DATABASE},
        {"name": "DynamoDB", "category": SkillCategory.DATABASE},
    ]
    
    skills = []
    for skill_data in skills_data:
        skill = Skill(**skill_data)
        session.add(skill)
        skills.append(skill)
    
    session.commit()
    for skill in skills:
        session.refresh(skill)
    return skills


def seed_job_postings(
    session: Session,
    companies: list[Company],
    locations: list[Location],
    skills: list[Skill]
) -> list[JobPosting]:
    """Seed job posting data."""
    
    job_titles = [
        "Senior Backend Engineer",
        "Frontend Developer",
        "Full Stack Engineer",
        "Staff Software Engineer",
        "Principal Engineer",
        "DevOps Engineer",
        "Site Reliability Engineer",
        "Data Scientist",
        "Machine Learning Engineer",
        "Data Engineer",
        "Product Manager",
        "Engineering Manager",
        "iOS Developer",
        "Android Developer",
        "Security Engineer",
        "Cloud Architect",
        "Platform Engineer",
    ]
    
    sources = ["LinkedIn", "Indeed", "Glassdoor", "RemoteOK", "StackOverflow"]
    
    jobs = []
    for i in range(500):  # Create 500 job postings
        title = random.choice(job_titles)
        company = random.choice(companies)
        location = random.choice(locations)
        
        # Salary ranges based on title
        if "Senior" in title or "Staff" in title:
            base_salary = random.randint(150000, 250000)
        elif "Principal" in title or "Manager" in title:
            base_salary = random.randint(200000, 350000)
        else:
            base_salary = random.randint(100000, 180000)
        
        salary_min = int(base_salary * 0.85)
        salary_max = int(base_salary * 1.15)
        
        # Random posting date within last 90 days
        days_ago = random.randint(0, 90)
        posting_date = date.today() - timedelta(days=days_ago)
        created_at = datetime.utcnow() - timedelta(days=days_ago)
        
        job = JobPosting(
            external_id=f"JOB-{i+1000}",
            source=random.choice(sources),
            title=title,
            description=f"We are looking for a {title} to join our team at {company.name}.",
            company_id=company.id,
            location_id=location.id,
            salary_min=salary_min,
            salary_max=salary_max,
            salary_currency="USD",
            salary_period="year",
            employment_type=random.choice(list(EmploymentType)),
            seniority=random.choice(list(SeniorityLevel)),
            remote_type=random.choice(list(RemoteType)),
            posting_date=posting_date,
            is_active=random.random() > 0.1,  # 90% active
            url=f"https://jobs.example.com/{i+1000}",
            created_at=created_at,
        )
        session.add(job)
        jobs.append(job)
    
    session.commit()
    
    # Refresh and add skills to jobs
    for job in jobs:
        session.refresh(job)
        # Add 2-5 random skills to each job
        job_skills = random.sample(skills, random.randint(2, 5))
        for skill in job_skills:
            link = JobSkillLink(
                job_id=job.id,
                skill_id=skill.id,
                relevancy_score=random.uniform(0.7, 1.0)
            )
            session.add(link)
    
    session.commit()
    return jobs


def seed_source_configs(session: Session):
    """Seed scraping source configurations."""
    sources = [
        {"name": "LinkedIn Jobs", "source_type": "api", "base_url": "https://linkedin.com/jobs", "is_active": True, "last_run_jobs_fetched": 1240, "last_run_errors": 25, "last_run_at": datetime.utcnow() - timedelta(minutes=10)},
        {"name": "Indeed", "source_type": "html_scraper", "base_url": "https://indeed.com", "is_active": True, "last_run_jobs_fetched": 850, "last_run_errors": 42, "last_run_at": datetime.utcnow() - timedelta(hours=1)},
        {"name": "Glassdoor", "source_type": "html_scraper", "base_url": "https://glassdoor.com", "is_active": False, "last_run_jobs_fetched": 45, "last_run_errors": 400, "last_run_at": datetime.utcnow() - timedelta(hours=2)},
        {"name": "RemoteOK", "source_type": "api", "base_url": "https://remoteok.com", "is_active": True, "last_run_jobs_fetched": 320, "last_run_errors": 0, "last_run_at": datetime.utcnow() - timedelta(minutes=30)},
        {"name": "Stack Overflow", "source_type": "api", "base_url": "https://stackoverflow.com/jobs", "is_active": False, "last_run_jobs_fetched": 0, "last_run_errors": 0, "last_run_at": datetime.utcnow() - timedelta(days=1)},
    ]
    
    for source_data in sources:
        source = SourceConfig(**source_data)
        session.add(source)
    
    session.commit()


def seed_daily_stats(session: Session, skills: list[Skill], locations: list[Location]):
    """Seed daily aggregate statistics."""
    today = date.today()
    
    # Generate stats for last 90 days
    for days_ago in range(90):
        stat_date = today - timedelta(days=days_ago)
        
        # Global stats
        base_jobs = 5000 + random.randint(-500, 500)
        # Add growth trend
        trend_factor = 1 + (90 - days_ago) * 0.002
        total_jobs = int(base_jobs * trend_factor)
        
        global_stat = DailyGlobalStats(
            date=stat_date,
            total_jobs=total_jobs,
            new_jobs=random.randint(100, 500),
            unique_companies=random.randint(150, 300),
            unique_locations=random.randint(40, 80),
            unique_skills=random.randint(80, 120),
            median_salary=random.randint(140000, 160000),
        )
        session.add(global_stat)
        
        # Skill stats (sample some skills)
        for skill in random.sample(skills, min(10, len(skills))):
            skill_stat = DailySkillStats(
                skill_id=skill.id,
                date=stat_date,
                job_count=random.randint(50, 500),
                unique_companies=random.randint(10, 50),
                unique_locations=random.randint(5, 20),
                median_salary=random.randint(120000, 180000),
                growth_rate_7d=random.uniform(-10, 25),
                growth_rate_30d=random.uniform(-15, 40),
            )
            session.add(skill_stat)
        
        # Location stats (sample some locations)
        for location in random.sample(locations, min(5, len(locations))):
            loc_stat = DailyLocationStats(
                location_id=location.id,
                date=stat_date,
                job_count=random.randint(100, 1000),
                unique_companies=random.randint(20, 80),
                median_salary=random.randint(130000, 190000),
                growth_rate_7d=random.uniform(-5, 15),
            )
            session.add(loc_stat)
    
    session.commit()


def main():
    """Run the seed script."""
    print("🌱 Starting database seed...")
    
    # Initialize database
    init_db()
    
    with Session(engine) as session:
        print("📍 Seeding locations...")
        locations = seed_locations(session)
        print(f"   Created {len(locations)} locations")
        
        print("🏢 Seeding companies...")
        companies = seed_companies(session, locations)
        print(f"   Created {len(companies)} companies")
        
        print("🔧 Seeding skills...")
        skills = seed_skills(session)
        print(f"   Created {len(skills)} skills")
        
        print("📋 Seeding job postings...")
        jobs = seed_job_postings(session, companies, locations, skills)
        print(f"   Created {len(jobs)} job postings")
        
        print("⚙️  Seeding source configurations...")
        seed_source_configs(session)
        print("   Created source configs")
        
        print("📊 Seeding daily statistics...")
        seed_daily_stats(session, skills, locations)
        print("   Created 90 days of stats")
    
    print("✅ Database seeded successfully!")


if __name__ == "__main__":
    main()
