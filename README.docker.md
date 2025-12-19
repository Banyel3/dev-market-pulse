# Docker Setup for DevMarket Pulse

## Quick Start

Run the entire application stack with a single command:

```bash
docker-compose up
```

This will start:
- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Task queue broker
- **Backend API** (port 8000) - FastAPI application
- **Celery Worker** - Background task processor
- **Celery Beat** - Task scheduler (runs scrapers at midnight)
- **Flower** (port 5555) - Celery monitoring dashboard
- **Frontend** (port 3000) - Next.js application

## Services

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Flower Dashboard**: http://localhost:5555
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Service Details

#### PostgreSQL
- Database: `devmarket_pulse`
- User: `devmarket`
- Password: `devmarket123`
- Data persisted in `postgres_data` volume

#### Redis
- Used by Celery for task queue
- Data persisted in `redis_data` volume

#### Backend API
- Automatically seeds database on startup
- Hot-reload enabled for development

#### Celery Services
- **Worker**: Executes background tasks (scraping, aggregation)
- **Beat**: Schedules tasks (midnight scraping, 1 AM aggregation, 2 AM cleanup)
- **Flower**: Web-based monitoring UI

## Commands

### Start All Services
```bash
docker-compose up
```

### Start in Detached Mode
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f celery-worker
docker-compose logs -f frontend
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Start)
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose build
```

### Rebuild and Start
```bash
docker-compose up --build
```

## Development Workflow

### Backend Development
The backend code is mounted as a volume, so changes to Python files will auto-reload:

```bash
# Edit files in ./backend/app/
# Changes are reflected immediately
```

### Database Operations

#### Execute SQL
```bash
docker-compose exec postgres psql -U devmarket -d devmarket_pulse
```

#### Backup Database
```bash
docker-compose exec postgres pg_dump -U devmarket devmarket_pulse > backup.sql
```

#### Restore Database
```bash
docker-compose exec -T postgres psql -U devmarket devmarket_pulse < backup.sql
```

### Manual Task Execution

#### Run Scrapers Manually
```bash
docker-compose exec backend python -c "
from app.tasks import scrape_jobs_task
scrape_jobs_task.apply_async()
"
```

#### Aggregate Statistics
```bash
# Specific date
docker-compose exec backend python aggregate_stats.py 2025-12-19

# Backfill 7 days
docker-compose exec backend python aggregate_stats.py backfill 7
```

#### Seed Database
```bash
docker-compose exec backend python -m app.seed
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Celery Issues
```bash
# Check worker status
docker-compose logs celery-worker

# Check beat scheduler
docker-compose logs celery-beat

# Restart Celery services
docker-compose restart celery-worker celery-beat
```

### Redis Issues
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

### Clean Slate
If you need to start fresh:
```bash
# Stop everything and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose up --build
```

## Production Deployment

For production, update the following in `docker-compose.yml`:

1. **Remove volume mounts** (lines with `./backend/app:/app/app`)
2. **Change passwords** in environment variables
3. **Remove `--reload`** flag from backend command
4. **Add SSL/TLS** configuration
5. **Configure reverse proxy** (nginx/traefik)
6. **Set up monitoring** and logging
7. **Use environment files** instead of hardcoded values

Example production override:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SCRAPING_ENABLED` - Enable/disable scrapers
- `MAX_JOBS_PER_SCRAPE` - Limit jobs per scraper run
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend

## Scheduled Tasks

Celery Beat runs these tasks automatically:

- **12:00 AM (midnight)** - Run all scrapers
- **1:00 AM** - Aggregate daily statistics
- **2:00 AM** - Clean up old jobs (>60 days)

View scheduled tasks in Flower: http://localhost:5555

## Data Persistence

Data is persisted in Docker volumes:
- `postgres_data` - Database data
- `redis_data` - Redis data

To backup volumes:
```bash
docker run --rm -v devmarket-pulse_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

## Health Checks

Services include health checks:
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`

Dependent services wait for health checks before starting.
