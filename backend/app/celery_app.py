"""Celery application configuration."""

from celery import Celery
from celery.schedules import crontab
from app.config import get_settings

settings = get_settings()

# Initialize Celery
celery_app = Celery(
    "devmarket_pulse",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=['app.tasks']
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Configure Celery Beat schedule
celery_app.conf.beat_schedule = {
    'scrape-jobs-daily': {
        'task': 'app.tasks.scrape_jobs_task',
        'schedule': crontab(hour=0, minute=0),  # Run at midnight every day
        'options': {'expires': 3600}  # Expire after 1 hour if not picked up
    },
    'aggregate-daily-stats': {
        'task': 'app.tasks.aggregate_daily_stats_task',
        'schedule': crontab(hour=1, minute=0),  # Run at 1 AM every day (after scraping)
        'options': {'expires': 3600}
    },
    'cleanup-old-jobs': {
        'task': 'app.tasks.cleanup_old_jobs_task',
        'schedule': crontab(hour=2, minute=0),  # Run at 2 AM every day
        'options': {'expires': 3600}
    }
}

celery_app.conf.task_routes = {
    'app.tasks.scrape_jobs_task': {'queue': 'scraping'},
    'app.tasks.aggregate_daily_stats_task': {'queue': 'analytics'},
    'app.tasks.cleanup_old_jobs_task': {'queue': 'maintenance'},
}
