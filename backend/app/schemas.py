from sqlmodel import SQLModel
from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel
from app.models import SkillCategory, EmploymentType, SeniorityLevel, RemoteType


# ============ Response Schemas ============

class KPIResponse(BaseModel):
    jobs_last_24h: int
    jobs_last_7d: int
    unique_companies: int
    unique_locations: int
    total_skills: int
    new_skills_this_week: int
    median_salary: Optional[float]


class TrendDataPoint(BaseModel):
    date: str
    jobs: int
    skills: Optional[int] = None


class TrendResponse(BaseModel):
    data: List[TrendDataPoint]
    time_range: str


class SkillTrendItem(BaseModel):
    id: int
    name: str
    category: str
    demand_count: int
    growth_rate: float
    median_salary: Optional[float]


class SkillInsightResponse(BaseModel):
    skills: List[SkillTrendItem]
    total: int


class CompanyItem(BaseModel):
    id: int
    name: str
    industry: str
    logo_url: Optional[str]
    active_jobs: int
    top_skill: Optional[str]


class CompanyListResponse(BaseModel):
    companies: List[CompanyItem]
    total: int


class LocationItem(BaseModel):
    id: int
    city: str
    country: str
    job_count: int
    growth_rate: float
    avg_salary: float


class LocationListResponse(BaseModel):
    locations: List[LocationItem]
    total: int


class SalaryDataPoint(BaseModel):
    role: str
    min_salary: float
    median_salary: float
    max_salary: float
    job_count: int


class SalaryInsightResponse(BaseModel):
    salaries: List[SalaryDataPoint]
    period: str  # annual or monthly
    growth_yoy: Optional[float] = None
    top_paying_location: Optional[str] = None
    top_location_salary: Optional[float] = None
    top_paying_role: Optional[str] = None
    top_role_salary: Optional[float] = None


class JobStreamItem(BaseModel):
    id: int
    name: str
    status: str  # active, paused, error
    last_run: Optional[str]
    jobs_fetched: int
    success_rate: Optional[float]


class JobStreamResponse(BaseModel):
    streams: List[JobStreamItem]


# ============ Request Schemas ============

class SkillFilterParams(BaseModel):
    search: Optional[str] = None
    categories: Optional[List[SkillCategory]] = None
    time_range: Optional[str] = "7d"  # 7d, 30d, 90d, 1y


class SalaryFilterParams(BaseModel):
    roles: Optional[List[str]] = None
    locations: Optional[List[int]] = None
    skills: Optional[List[int]] = None
    remote_only: bool = False
    period: str = "annual"  # annual or monthly


class LocationFilterParams(BaseModel):
    region_group: Optional[str] = None
    country: Optional[str] = None
    min_jobs: Optional[int] = None
