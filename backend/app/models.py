from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, date as date_type
from enum import Enum


class EmploymentType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    FREELANCE = "freelance"
    INTERNSHIP = "internship"


class SeniorityLevel(str, Enum):
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    PRINCIPAL = "principal"
    MANAGER = "manager"
    DIRECTOR = "director"
    VP = "vp"
    C_LEVEL = "c_level"


class RemoteType(str, Enum):
    ONSITE = "onsite"
    REMOTE = "remote"
    HYBRID = "hybrid"


class SkillCategory(str, Enum):
    LANGUAGE = "language"
    FRAMEWORK = "framework"
    TOOL = "tool"
    CLOUD = "cloud"
    DATABASE = "database"
    SOFT_SKILL = "soft_skill"
    OTHER = "other"


# ============ Link Tables ============

class JobSkillLink(SQLModel, table=True):
    __tablename__ = "job_skill_link"
    
    job_id: int = Field(foreign_key="job_postings.id", primary_key=True)
    skill_id: int = Field(foreign_key="skills.id", primary_key=True)
    relevancy_score: float = Field(default=1.0)


# ============ Core Models ============

class Location(SQLModel, table=True):
    __tablename__ = "locations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    city: str = Field(index=True)
    region: Optional[str] = None
    country: str = Field(index=True)
    country_code: Optional[str] = Field(max_length=3)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region_group: Optional[str] = None  # EMEA, APAC, Americas, etc.
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    companies: List["Company"] = Relationship(back_populates="hq_location")
    job_postings: List["JobPosting"] = Relationship(back_populates="location")


class Company(SQLModel, table=True):
    __tablename__ = "companies"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    website: Optional[str] = None
    domain: Optional[str] = None
    industry: Optional[str] = None
    size_bucket: Optional[str] = None  # 1-10, 11-50, 51-200, etc.
    logo_url: Optional[str] = None
    
    hq_location_id: Optional[int] = Field(default=None, foreign_key="locations.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    hq_location: Optional[Location] = Relationship(back_populates="companies")
    job_postings: List["JobPosting"] = Relationship(back_populates="company")


class Skill(SQLModel, table=True):
    __tablename__ = "skills"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: SkillCategory = Field(default=SkillCategory.OTHER)
    synonyms: Optional[str] = None  # Comma-separated synonyms
    is_active: bool = Field(default=True)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    job_postings: List["JobPosting"] = Relationship(back_populates="skills", link_model=JobSkillLink)


class JobPosting(SQLModel, table=True):
    __tablename__ = "job_postings"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: Optional[str] = Field(index=True)  # ID from source
    source: str = Field(index=True)  # linkedin, indeed, etc.
    
    title: str = Field(index=True)
    description: Optional[str] = None
    
    company_id: Optional[int] = Field(default=None, foreign_key="companies.id")
    location_id: Optional[int] = Field(default=None, foreign_key="locations.id")
    
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: Optional[str] = Field(default="USD", max_length=3)
    salary_period: Optional[str] = Field(default="year")  # year, month, hour
    salary_is_approximate: bool = Field(default=False)
    
    employment_type: Optional[EmploymentType] = None
    seniority: Optional[SeniorityLevel] = None
    remote_type: Optional[RemoteType] = None
    
    posting_date: Optional[date_type] = None
    expiry_date: Optional[date_type] = None
    is_active: bool = Field(default=True)
    
    url: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    company: Optional[Company] = Relationship(back_populates="job_postings")
    location: Optional[Location] = Relationship(back_populates="job_postings")
    skills: List[Skill] = Relationship(back_populates="job_postings", link_model=JobSkillLink)


# ============ Aggregate Tables ============

class DailySkillStats(SQLModel, table=True):
    __tablename__ = "daily_skill_stats"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    skill_id: int = Field(foreign_key="skills.id", index=True)
    date: date_type = Field(index=True)
    
    job_count: int = Field(default=0)
    unique_companies: int = Field(default=0)
    unique_locations: int = Field(default=0)
    median_salary: Optional[float] = None
    growth_rate_7d: Optional[float] = None  # % change vs 7 days ago
    growth_rate_30d: Optional[float] = None  # % change vs 30 days ago
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DailyLocationStats(SQLModel, table=True):
    __tablename__ = "daily_location_stats"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    location_id: int = Field(foreign_key="locations.id", index=True)
    date: date_type = Field(index=True)
    
    job_count: int = Field(default=0)
    unique_companies: int = Field(default=0)
    median_salary: Optional[float] = None
    growth_rate_7d: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DailyCompanyStats(SQLModel, table=True):
    __tablename__ = "daily_company_stats"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: int = Field(foreign_key="companies.id", index=True)
    date: date_type = Field(index=True)
    
    job_count: int = Field(default=0)
    median_salary: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DailyGlobalStats(SQLModel, table=True):
    __tablename__ = "daily_global_stats"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date_type = Field(index=True, unique=True)
    
    total_jobs: int = Field(default=0)
    new_jobs: int = Field(default=0)
    unique_companies: int = Field(default=0)
    unique_locations: int = Field(default=0)
    unique_skills: int = Field(default=0)
    median_salary: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ============ Source Configuration ============

class SourceConfig(SQLModel, table=True):
    __tablename__ = "source_configs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    source_type: str  # api, html_scraper
    base_url: Optional[str] = None
    is_active: bool = Field(default=True)
    schedule_cron: Optional[str] = None  # Cron expression
    rate_limit_per_minute: int = Field(default=60)
    
    last_run_at: Optional[datetime] = None
    last_run_status: Optional[str] = None
    last_run_jobs_fetched: int = Field(default=0)
    last_run_errors: int = Field(default=0)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
