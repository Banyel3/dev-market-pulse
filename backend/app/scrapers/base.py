"""Base scraper class."""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from sqlmodel import Session

from app.models import (
    JobPosting, Company, Location, Skill, JobSkillLink,
    EmploymentType, SeniorityLevel, RemoteType, SkillCategory
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Base class for all job board scrapers."""
    
    def __init__(self, session: Session):
        self.session = session
        self.source_name = "unknown"
        
    @abstractmethod
    async def scrape(self, search_query: str = "software engineer", limit: int = 50) -> List[Dict[str, Any]]:
        """Scrape job postings from the source."""
        pass
    
    def parse_employment_type(self, text: str) -> Optional[EmploymentType]:
        """Parse employment type from text."""
        text_lower = text.lower()
        if "full" in text_lower and "time" in text_lower:
            return EmploymentType.FULL_TIME
        elif "part" in text_lower and "time" in text_lower:
            return EmploymentType.PART_TIME
        elif "contract" in text_lower:
            return EmploymentType.CONTRACT
        elif "freelance" in text_lower:
            return EmploymentType.FREELANCE
        elif "intern" in text_lower:
            return EmploymentType.INTERNSHIP
        return EmploymentType.FULL_TIME
    
    def parse_seniority(self, title: str, description: str = "") -> Optional[SeniorityLevel]:
        """Parse seniority level from job title and description."""
        text = (title + " " + description).lower()
        
        if any(word in text for word in ["cto", "ceo", "cfo", "chief"]):
            return SeniorityLevel.C_LEVEL
        elif any(word in text for word in ["vp", "vice president"]):
            return SeniorityLevel.VP
        elif "director" in text:
            return SeniorityLevel.DIRECTOR
        elif "manager" in text or "lead" in text:
            return SeniorityLevel.MANAGER
        elif "principal" in text or "staff" in text:
            return SeniorityLevel.PRINCIPAL
        elif "senior" in text or "sr" in text:
            return SeniorityLevel.SENIOR
        elif "junior" in text or "jr" in text or "entry" in text:
            return SeniorityLevel.JUNIOR
        else:
            return SeniorityLevel.MID
    
    def parse_remote_type(self, text: str) -> Optional[RemoteType]:
        """Parse remote work type from text."""
        text_lower = text.lower()
        if "remote" in text_lower and "hybrid" not in text_lower:
            return RemoteType.REMOTE
        elif "hybrid" in text_lower:
            return RemoteType.HYBRID
        else:
            return RemoteType.ONSITE
    
    def extract_skills(self, title: str, description: str) -> List[str]:
        """Extract skills from job title and description."""
        # Common tech skills to look for
        skill_patterns = {
            # Languages
            "python": SkillCategory.LANGUAGE,
            "javascript": SkillCategory.LANGUAGE,
            "typescript": SkillCategory.LANGUAGE,
            "java": SkillCategory.LANGUAGE,
            "c++": SkillCategory.LANGUAGE,
            "c#": SkillCategory.LANGUAGE,
            "go": SkillCategory.LANGUAGE,
            "golang": SkillCategory.LANGUAGE,
            "rust": SkillCategory.LANGUAGE,
            "php": SkillCategory.LANGUAGE,
            "ruby": SkillCategory.LANGUAGE,
            "swift": SkillCategory.LANGUAGE,
            "kotlin": SkillCategory.LANGUAGE,
            "scala": SkillCategory.LANGUAGE,
            "r": SkillCategory.LANGUAGE,
            
            # Frameworks
            "react": SkillCategory.FRAMEWORK,
            "reactjs": SkillCategory.FRAMEWORK,
            "vue": SkillCategory.FRAMEWORK,
            "vuejs": SkillCategory.FRAMEWORK,
            "angular": SkillCategory.FRAMEWORK,
            "node.js": SkillCategory.FRAMEWORK,
            "nodejs": SkillCategory.FRAMEWORK,
            "express": SkillCategory.FRAMEWORK,
            "django": SkillCategory.FRAMEWORK,
            "flask": SkillCategory.FRAMEWORK,
            "fastapi": SkillCategory.FRAMEWORK,
            "spring": SkillCategory.FRAMEWORK,
            "spring boot": SkillCategory.FRAMEWORK,
            ".net": SkillCategory.FRAMEWORK,
            "asp.net": SkillCategory.FRAMEWORK,
            "laravel": SkillCategory.FRAMEWORK,
            "rails": SkillCategory.FRAMEWORK,
            "next.js": SkillCategory.FRAMEWORK,
            "nextjs": SkillCategory.FRAMEWORK,
            
            # Cloud
            "aws": SkillCategory.CLOUD,
            "azure": SkillCategory.CLOUD,
            "gcp": SkillCategory.CLOUD,
            "google cloud": SkillCategory.CLOUD,
            "kubernetes": SkillCategory.CLOUD,
            "k8s": SkillCategory.CLOUD,
            "docker": SkillCategory.TOOL,
            "terraform": SkillCategory.CLOUD,
            
            # Databases
            "postgresql": SkillCategory.DATABASE,
            "postgres": SkillCategory.DATABASE,
            "mysql": SkillCategory.DATABASE,
            "mongodb": SkillCategory.DATABASE,
            "redis": SkillCategory.DATABASE,
            "elasticsearch": SkillCategory.DATABASE,
            "dynamodb": SkillCategory.DATABASE,
            "oracle": SkillCategory.DATABASE,
            "sql server": SkillCategory.DATABASE,
            "cassandra": SkillCategory.DATABASE,
            
            # Tools
            "git": SkillCategory.TOOL,
            "github": SkillCategory.TOOL,
            "gitlab": SkillCategory.TOOL,
            "jenkins": SkillCategory.TOOL,
            "ci/cd": SkillCategory.TOOL,
            "jira": SkillCategory.TOOL,
            "linux": SkillCategory.TOOL,
            "unix": SkillCategory.TOOL,
            "bash": SkillCategory.TOOL,
        }
        
        text = (title + " " + description).lower()
        found_skills = []
        
        for skill, category in skill_patterns.items():
            # Use word boundary matching for short skills (<=3 chars)
            if len(skill) <= 3:
                import re
                # Match whole word only (with word boundaries)
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text):
                    skill_name = skill.upper()
                    if skill_name not in found_skills:
                        found_skills.append(skill_name)
            else:
                if skill.lower() in text:
                    # Normalize skill name
                    skill_name = skill.title() if len(skill) > 3 else skill.upper()
                    if skill_name not in found_skills:
                        found_skills.append(skill_name)
        
        return found_skills
    
    def get_or_create_company(self, name: str, **kwargs) -> Company:
        """Get or create a company."""
        # Check if company exists
        company = self.session.query(Company).filter(Company.name == name).first()
        if company:
            return company
        
        # Create new company
        company = Company(name=name, **kwargs)
        self.session.add(company)
        self.session.flush()
        return company
    
    def get_or_create_location(self, city: str, country: str, **kwargs) -> Location:
        """Get or create a location."""
        # Check if location exists
        location = self.session.query(Location).filter(
            Location.city == city,
            Location.country == country
        ).first()
        if location:
            return location
        
        # Create new location
        location = Location(city=city, country=country, **kwargs)
        self.session.add(location)
        self.session.flush()
        return location
    
    def get_or_create_skill(self, name: str, category: SkillCategory = SkillCategory.OTHER) -> Skill:
        """Get or create a skill."""
        # Check if skill exists
        skill = self.session.query(Skill).filter(Skill.name == name).first()
        if skill:
            return skill
        
        # Create new skill
        skill = Skill(name=name, category=category)
        self.session.add(skill)
        self.session.flush()
        return skill
    
    def save_job(self, job_data: Dict[str, Any]) -> Optional[JobPosting]:
        """Save a job posting to database."""
        try:
            # Check if job already exists
            existing_job = self.session.query(JobPosting).filter(
                JobPosting.external_id == job_data.get("external_id"),
                JobPosting.source == self.source_name
            ).first()
            
            if existing_job:
                logger.info(f"Job already exists: {job_data.get('title')}")
                return existing_job
            
            # Get or create company
            company = self.get_or_create_company(
                name=job_data["company_name"],
                industry=job_data.get("industry")
            )
            
            # Get or create location
            location = self.get_or_create_location(
                city=job_data["location_city"],
                country=job_data.get("location_country", "USA")
            )
            
            # Create job posting
            job = JobPosting(
                external_id=job_data.get("external_id"),
                source=self.source_name,
                title=job_data["title"],
                description=job_data.get("description"),
                company_id=company.id,
                location_id=location.id,
                salary_min=job_data.get("salary_min"),
                salary_max=job_data.get("salary_max"),
                salary_currency=job_data.get("salary_currency", "USD"),
                salary_period=job_data.get("salary_period", "year"),
                employment_type=job_data.get("employment_type"),
                seniority=job_data.get("seniority"),
                remote_type=job_data.get("remote_type"),
                url=job_data.get("url"),
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            self.session.add(job)
            self.session.flush()
            
            # Add skills
            skills = job_data.get("skills", [])
            for skill_name in skills:
                skill = self.get_or_create_skill(skill_name)
                link = JobSkillLink(job_id=job.id, skill_id=skill.id)
                self.session.add(link)
            
            self.session.commit()
            logger.info(f"Saved job: {job.title} at {company.name}")
            return job
            
        except Exception as e:
            self.session.rollback()
            logger.error(f"Error saving job: {str(e)}")
            return None
