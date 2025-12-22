# DevMarket Pulse - Celery Setup Guide

## Overview

This application uses **Celery** with **Redis** for automated daily job scraping and analytics aggregation.

## Prerequisites

### Install Redis

You need Redis running locally. Choose one option:

**Option 1: WSL (Recommended for Windows)**

```bash
wsl --install
# Then in WSL:
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**Option 2: Docker**

```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option 3: Windows Native**
Download from: https://github.com/microsoftarchive/redis/releases

### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Running the System

### 1. Start Redis

```bash
# WSL
sudo service redis-server start

# Docker
docker start redis

# Check Redis is running
redis-cli ping
# Should return: PONG
```

### 2. Start Celery Worker

Opens a new terminal and run:

```bash
cd backend
python -m app.worker
```

This processes the background tasks (scraping, aggregation, cleanup).

### 3. Start Celery Beat Scheduler

Open another terminal and run:

```bash
cd backend
python -m app.beat
```

This schedules tasks to run at specific times.

### 4. Start FastAPI Server

In another terminal:

```bash
cd backend
uvicorn app.main:app --reload
```

## Scheduled Tasks

### Daily at 12:00 AM (Midnight)

- **Scrape Jobs**: Collect new job postings from Indeed and RemoteOK

### Daily at 1:00 AM

- **Aggregate Stats**: Calculate daily statistics for:
  - Skill demand trends
  - Company hiring trends
  - Location-based analytics
  - Global market metrics

### Daily at 2:00 AM

- **Cleanup Old Jobs**: Mark jobs older than 60 days as inactive

## Manual Task Triggers

### Run Scraping Now

```python
from app.tasks import trigger_scraping_now
trigger_scraping_now.delay()
```

### Aggregate Stats for Specific Date

```python
from app.tasks import trigger_aggregation_now
trigger_aggregation_now.delay(target_date="2025-12-19")
```

## Monitoring

### Flower - Web-based Monitoring

Start Flower to monitor tasks:

```bash
cd backend
celery -A app.celery_app flower --port=5555
```

Then open: http://localhost:5555

### Check Task Status

```python
from app.celery_app import celery_app

# Get active tasks
celery_app.control.inspect().active()

# Get scheduled tasks
celery_app.control.inspect().scheduled()

# Get task stats
celery_app.control.inspect().stats()
```

## Historical Data Analytics

The system automatically tracks daily metrics:

### Check Python Job Trends

```python
from sqlmodel import Session, select
from app.database import engine
from app.models import DailySkillStats, Skill
from datetime import datetime, timedelta

session = Session(engine)

# Get Python skill
python = session.exec(select(Skill).where(Skill.name == "Python")).first()

# Get last 30 days of data
thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
stats = session.exec(
    select(DailySkillStats)
    .where(
        DailySkillStats.skill_id == python.id,
        DailySkillStats.date >= thirty_days_ago
    )
    .order_by(DailySkillStats.date)
).all()

# Print trend
for stat in stats:
    print(f"{stat.date}: {stat.job_count} jobs, Growth: {stat.growth_rate_7d}%")
```

### Query Daily Global Stats

```python
from app.models import DailyGlobalStats

# Get today's stats
today_stats = session.exec(
    select(DailyGlobalStats)
    .order_by(DailyGlobalStats.date.desc())
    .limit(1)
).first()

print(f"Total Jobs: {today_stats.total_jobs}")
print(f"Unique Skills: {today_stats.unique_skills}")
print(f"Active Companies: {today_stats.unique_companies}")
```

## Troubleshooting

### Redis Connection Error

```
Error: Error 10061 connecting to localhost:6379
```

**Solution**: Make sure Redis is running (`redis-cli ping`)

### Task Not Running

1. Check Celery worker is running
2. Check Celery beat is running
3. Check Redis connection
4. View logs in worker/beat terminals

### Manual Stats Aggregation

If you need to backfill historical data:

```bash
cd backend
python
```

```python
from app.tasks import aggregate_daily_stats_task
from datetime import datetime, timedelta

# Aggregate last 7 days
for i in range(7):
    date = (datetime.utcnow() - timedelta(days=i)).date()
    aggregate_daily_stats_task(target_date=date.isoformat())
```

## Environment Variables

Add to `.env` file:

```env
# Redis
REDIS_URL=redis://localhost:6379/0

# Scraping
SCRAPING_ENABLED=true
MAX_JOBS_PER_SCRAPE=100
```

## Architecture

```
┌─────────────────────────────────────────┐
│          Celery Beat Scheduler          │
│  (Triggers tasks at scheduled times)    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Redis Message Queue           │
│      (Stores pending task messages)     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          Celery Worker Process          │
│     (Executes tasks: scraping, etc)     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        SQLite Database (SQLModel)       │
│  (Stores jobs, stats, historical data)  │
└─────────────────────────────────────────┘
```
