# 🔄 Scraper Guide - DevMarket Pulse

Complete guide to running job scrapers manually and understanding the scraping system.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Available Scrapers](#available-scrapers)
- [Manual Execution Methods](#manual-execution-methods)
- [Automated Scheduling](#automated-scheduling)
- [Troubleshooting](#troubleshooting)
- [Data Flow](#data-flow)

---

## 🚀 Quick Start

### Prerequisites

- Docker containers must be running
- PostgreSQL database must be healthy
- Backend container accessible

### Fastest Method (Docker Exec)

```powershell
# Run all scrapers (Python + ML Engineer)
docker exec -it devmarket-backend python -m app.run_scrapers

# Run with custom search terms
docker exec -it devmarket-backend python -c "from app.run_scrapers import run_all_scrapers; run_all_scrapers(search_terms=['python developer', 'frontend developer', 'data scientist'])"
```

---

## 📦 Available Scrapers

### 1. Indeed Scraper (`app/scrapers/indeed.py`)

- **Source**: Indeed.com job board
- **Default Search Terms**: `python developer`, `machine learning engineer`, `frontend developer`
- **Max Jobs Per Search**: 50 (configurable via `MAX_JOBS_PER_SCRAPE` env var)
- **Features**:
  - Automatic deduplication (checks `external_id`)
  - Company and location extraction
  - Skill detection (Python, JavaScript, React, Node.js, Docker, Kubernetes, R, etc.)
  - Salary parsing when available
  - Remote/Hybrid/Onsite detection
  - Seniority level extraction

### 2. Remote OK Scraper (`app/scrapers/remoteok.py`)

- **Source**: RemoteOK.io remote job board
- **Specialization**: Remote positions only
- **Max Jobs Per Search**: 50
- **Features**:
  - Remote-first jobs
  - Global locations
  - Tech-focused positions
  - Salary data when available

---

## 🎯 Manual Execution Methods

### Method 1: Docker Exec (Recommended for Production)

```powershell
# Standard execution - runs default search terms
docker exec -it devmarket-backend python -m app.run_scrapers

# View logs in real-time
docker logs -f devmarket-backend

# Check last scraping results
docker exec -it devmarket-backend python -c "from sqlmodel import Session, select; from app.database import engine; from app.models import JobPosting; session = Session(engine); recent = session.exec(select(JobPosting).order_by(JobPosting.created_at.desc()).limit(10)).all(); [print(f'{j.title} at {j.company_id} - {j.created_at}') for j in recent]"
```

### Method 2: Celery Task (Asynchronous)

```powershell
# Trigger scraping task via Celery
docker exec -it devmarket-celery-worker celery -A app.celery_app call app.tasks.scrape_jobs_task

# Check task status via Flower UI
# Open browser: http://localhost:5555

# Or trigger via API endpoint
curl -X POST http://localhost:8000/api/admin/trigger-scrape
```

### Method 3: Backend API Endpoint

```powershell
# Create endpoint in backend/app/routers/admin.py (if needed)
curl -X POST http://localhost:8000/api/scrape/trigger \
  -H "Content-Type: application/json" \
  -d '{"search_terms": ["python developer", "devops engineer"]}'
```

### Method 4: Direct Python Script (Development)

If you want to test scrapers locally outside Docker:

```powershell
# Navigate to backend directory
cd backend

# Activate your Python environment if needed
# Then run:
python -m app.run_scrapers
```

---

## ⏱️ Automated Scheduling

### Celery Beat Configuration

Scrapers run automatically via Celery Beat scheduler (configured in `app/celery_app.py`):

**Default Schedule**:

- **Scraping Job**: Daily at midnight (00:00 UTC)
- **Stats Aggregation**: Daily at 1:00 AM UTC (after scraping completes)

### View Current Schedule

```powershell
# Check Celery Beat schedule
docker exec -it devmarket-celery-beat celery -A app.celery_app inspect scheduled

# View active workers
docker exec -it devmarket-celery-worker celery -A app.celery_app inspect active

# Monitor via Flower UI
# Open: http://localhost:5555
```

### Modify Schedule

Edit `backend/app/celery_app.py`:

```python
celery_app.conf.beat_schedule = {
    'scrape-jobs-daily': {
        'task': 'app.tasks.scrape_jobs_task',
        'schedule': crontab(hour=0, minute=0),  # Midnight UTC
        # Change to run every 6 hours:
        # 'schedule': crontab(minute=0, hour='*/6'),
    },
}
```

Then restart containers:

```powershell
docker-compose restart celery-beat celery-worker
```

---

## 🔍 Troubleshooting

### Issue: "Database does not exist"

**Solution**: Run clean restart to rebuild database

```powershell
.\clean-restart.ps1
```

### Issue: Scrapers not saving jobs

**Check**: Database connection

```powershell
# Verify PostgreSQL is healthy
docker ps | grep postgres

# Check DATABASE_URL in backend container
docker exec -it devmarket-backend env | grep DATABASE_URL

# Should show: postgresql+asyncpg://devmarket:devmarket123@postgres:5432/devmarket_pulse
```

### Issue: Duplicate jobs being inserted

**Cause**: External ID collision or scraper logic issue

**Debug**:

```powershell
# Check existing external IDs
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse -c "SELECT external_id, source, title FROM job_postings ORDER BY created_at DESC LIMIT 10;"
```

### Issue: Scrapers timing out

**Solution 1**: Increase Celery task timeout
Edit `backend/app/celery_app.py`:

```python
task_time_limit=30 * 60,  # 30 minutes (increase this)
```

**Solution 2**: Reduce MAX_JOBS_PER_SCRAPE
Edit `docker-compose.yml`:

```yaml
environment:
  MAX_JOBS_PER_SCRAPE: "20" # Reduce from 50
```

### Issue: Skills not being detected

**Check**: Skills table populated

```powershell
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse -c "SELECT COUNT(*) FROM skills;"

# If 0, seed the database
docker exec -it devmarket-backend python -m app.seed
```

---

## 📊 Data Flow

### Scraping Pipeline

```
1. run_scrapers.py triggers
   ↓
2. For each search term:
   - Indeed Scraper scrapes jobs
   - Remote OK Scraper scrapes jobs
   ↓
3. For each job:
   - Check if job exists (external_id + source)
   - If new:
     a. Create/find Company
     b. Create/find Location
     c. Create JobPosting
     d. Extract and link Skills
   ↓
4. Commit to PostgreSQL
   ↓
5. Dashboard API aggregates data
   ↓
6. Frontend displays via charts/tables
```

### Database Schema

**Key Tables**:

- `job_postings` - Core job data
- `companies` - Company information
- `locations` - Geographic data
- `skills` - Technology/skill taxonomy
- `job_skill_link` - Many-to-many relationship

### Data Retention

Currently all jobs are kept indefinitely. To implement cleanup:

```python
# Add to backend/app/tasks.py
@celery_app.task(name='app.tasks.cleanup_old_jobs')
def cleanup_old_jobs():
    """Mark jobs older than 90 days as inactive."""
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(days=90)

    with Session(engine) as session:
        stmt = (
            update(JobPosting)
            .where(JobPosting.created_at < cutoff)
            .values(is_active=False)
        )
        session.exec(stmt)
        session.commit()
```

---

## 📈 Monitoring Scraper Performance

### View Recent Scrapes

```powershell
# Count jobs by source
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse -c "
SELECT source, COUNT(*), MAX(created_at) as latest
FROM job_postings
GROUP BY source;"

# Jobs created in last 24 hours
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse -c "
SELECT COUNT(*)
FROM job_postings
WHERE created_at > NOW() - INTERVAL '24 hours';"

# Top companies by job count
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse -c "
SELECT c.name, COUNT(*) as jobs
FROM job_postings j
JOIN companies c ON j.company_id = c.id
GROUP BY c.name
ORDER BY jobs DESC
LIMIT 10;"
```

### Scraper Logs

```powershell
# Real-time scraper logs
docker logs -f devmarket-celery-worker | grep "scraper"

# Backend API logs
docker logs -f devmarket-backend

# Filter for specific scraper
docker logs devmarket-celery-worker 2>&1 | grep "indeed"
```

---

## 🎨 Customizing Scrapers

### Add New Search Terms

Edit `backend/app/run_scrapers.py`:

```python
def run_all_scrapers(search_terms=None):
    if search_terms is None:
        search_terms = [
            'python developer',
            'machine learning engineer',
            'frontend developer',
            # Add more:
            'devops engineer',
            'data scientist',
            'cloud architect',
        ]
```

### Add New Scraper

1. Create `backend/app/scrapers/newsource.py`:

```python
from app.scrapers.base import BaseScraper

class NewSourceScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="newsource", base_url="https://newsource.com")

    def scrape(self, search_term: str, limit: int = 50):
        # Your scraping logic
        pass
```

2. Register in `backend/app/run_scrapers.py`:

```python
from app.scrapers.newsource import NewSourceScraper

# In run_all_scrapers():
scrapers = [
    IndeedScraper(),
    RemoteOKScraper(),
    NewSourceScraper(),  # Add here
]
```

---

## 🔐 Rate Limiting & Best Practices

### Respectful Scraping

- Default: 2-second delay between requests
- User-Agent: Identifies as legitimate scraper
- Respects robots.txt
- Limits concurrent requests

### Adjust Rate Limits

Edit `backend/app/scrapers/base.py`:

```python
import time

class BaseScraper:
    def __init__(self, name, base_url, rate_limit_delay=2):
        self.rate_limit_delay = rate_limit_delay  # Increase if needed

    def _request(self, url):
        time.sleep(self.rate_limit_delay)
        # ... rest of logic
```

---

## 📞 Support & Contribution

### Common Commands Cheat Sheet

```powershell
# Start all services
docker-compose up -d

# Run scrapers
docker exec -it devmarket-backend python -m app.run_scrapers

# Check database
docker exec -it devmarket-postgres psql -U devmarket -d devmarket_pulse

# View logs
docker logs -f devmarket-backend

# Restart services
docker-compose restart

# Clean restart (removes volumes)
.\clean-restart.ps1

# Stop all services
docker-compose down
```

### Need Help?

- Check logs: `docker logs devmarket-backend`
- Verify database: `docker ps | grep postgres`
- Inspect Celery tasks: `http://localhost:5555` (Flower UI)
- Review API docs: `http://localhost:8000/docs` (FastAPI Swagger)

---

**Last Updated**: December 22, 2025  
**Platform Version**: DevMarket Pulse v1.0
