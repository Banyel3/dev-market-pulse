from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Database - supports both SQLite (local) and PostgreSQL (Docker/Production)
    # Default to SQLite for local dev, override with DATABASE_URL env var
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./devmarket_pulse.db")
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    frontend_url: str = "http://localhost:3000"
    
    # Redis for Celery
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Scraping
    scraping_enabled: bool = os.getenv("SCRAPING_ENABLED", "true").lower() == "true"
    max_jobs_per_scrape: int = int(os.getenv("MAX_JOBS_PER_SCRAPE", "100"))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
