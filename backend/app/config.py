from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Use SQLite for local development if PostgreSQL is not available
    # Switch to postgresql+psycopg://... when ready
    database_url: str = "sqlite:///./devmarket_pulse.db"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    frontend_url: str = "http://localhost:3000"
    
    # Redis for Celery
    redis_url: str = "redis://localhost:6379/0"
    
    # Scraping
    scraping_enabled: bool = True
    max_jobs_per_scrape: int = 100

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
