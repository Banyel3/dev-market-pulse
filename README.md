# DevMarket Pulse 📊

A real-time job market analytics dashboard that scrapes job postings from multiple sources (Indeed, RemoteOK) and provides insights into tech job trends, skills demand, salary ranges, and market dynamics.

## Features

- 🔍 **Automated Job Scraping** - Daily scraping from Indeed and RemoteOK
- 📈 **Historical Analytics** - Track job market trends over time
- 💰 **Salary Insights** - Median salaries by skill, location, and company
- 🎯 **Skill Tracking** - Monitor demand for specific technologies
- 🌍 **Location Analysis** - Job distribution across cities and remote opportunities
- 🏢 **Company Insights** - Track hiring trends by company
- ⏰ **Scheduled Tasks** - Automated daily scraping and aggregation
- 🐳 **Fully Dockerized** - One-command deployment

## Quick Start with Docker (Recommended)

```bash
# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Flower (Celery Monitor): http://localhost:5555
```

That's it! Docker will automatically:

- Set up PostgreSQL database
- Set up Redis for task queue
- Start the FastAPI backend
- Start Celery workers and scheduler
- Start the Next.js frontend
- Seed the database with initial data

See [README.docker.md](README.docker.md) for detailed Docker documentation.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js   │────▶│   FastAPI    │────▶│  PostgreSQL  │
│  Frontend   │     │   Backend    │     │   Database   │
└─────────────┘     └──────────────┘     └──────────────┘
                           │                      ▲
                           │                      │
                           ▼                      │
                    ┌──────────┐                 │
                    │  Redis   │                 │
                    └──────────┘                 │
                           │                      │
                           ▼                      │
              ┌─────────────────────┐            │
              │  Celery Beat        │            │
              │  (Scheduler)        │            │
              └─────────────────────┘            │
                           │                      │
                           ▼                      │
              ┌─────────────────────┐            │
              │  Celery Worker      │────────────┘
              │  (Task Processor)   │
              └─────────────────────┘
                           │
                           ▼
              ┌─────────────────────┐
              │  Web Scrapers       │
              │  - Indeed           │
              │  - RemoteOK         │
              └─────────────────────┘
```

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization

### Backend

- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL database ORM
- **PostgreSQL** - Primary database
- **Celery** - Distributed task queue
- **Redis** - Message broker
- **Playwright** - Browser automation for scraping
- **BeautifulSoup4** - HTML parsing

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **Flower** - Celery monitoring UI

## Local Development (Without Docker)

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 16+
- Redis 7+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://user:pass@localhost:5432/devmarket_pulse"
export REDIS_URL="redis://localhost:6379/0"

# Seed database
python -m app.seed

# Start API server
uvicorn app.main:app --reload

# In separate terminals:
# Start Celery worker
python -m app.worker

# Start Celery beat scheduler
python -m app.beat

# (Optional) Start Flower monitoring
celery -A app.celery_app flower
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Scheduled Tasks

Celery Beat automatically runs:

- **12:00 AM** - Scrape jobs from all sources
- **1:00 AM** - Aggregate daily statistics
- **2:00 AM** - Clean up old jobs (>60 days)

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `GET /api/dashboard/kpis` - Overview metrics
- `GET /api/dashboard/trends` - Historical trends
- `GET /api/dashboard/top-skills` - Most demanded skills
- `GET /api/dashboard/top-locations` - Top hiring locations
- `GET /api/dashboard/top-companies` - Top hiring companies
- `GET /api/dashboard/recent-jobs` - Latest job postings

## Project Structure

```
dev-market-pulse/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # Database connection
│   │   ├── models.py         # SQLModel models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── celery_app.py     # Celery configuration
│   │   ├── tasks.py          # Celery tasks
│   │   ├── worker.py         # Celery worker
│   │   ├── beat.py           # Celery beat
│   │   ├── seed.py           # Database seeding
│   │   ├── routers/          # API routes
│   │   │   └── dashboard.py
│   │   └── scrapers/         # Web scrapers
│   │       ├── base.py
│   │       ├── indeed.py
│   │       └── remoteok.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   └── lib/
│   │       └── api.ts        # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```env
# Database
DATABASE_URL=postgresql+asyncpg://devmarket:devmarket123@localhost:5432/devmarket_pulse

# Redis
REDIS_URL=redis://localhost:6379/0

# Scraping
SCRAPING_ENABLED=true
MAX_JOBS_PER_SCRAPE=50

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Manual Operations

### Trigger Scraping Manually

```bash
# Via Docker
docker-compose exec backend python -c "from app.tasks import scrape_jobs_task; scrape_jobs_task.apply_async()"

# Local
python -c "from app.tasks import scrape_jobs_task; scrape_jobs_task.apply_async()"
```

### Aggregate Statistics

```bash
# Specific date
docker-compose exec backend python aggregate_stats.py 2025-12-19

# Backfill last 7 days
docker-compose exec backend python aggregate_stats.py backfill 7
```

## Monitoring

- **Flower Dashboard**: http://localhost:5555

  - View active/completed tasks
  - Monitor worker health
  - Track task execution times
  - View scheduled tasks

- **API Health**: http://localhost:8000/health

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Create an issue on GitHub
- Check [README.docker.md](README.docker.md) for Docker-specific help
- Check [backend/CELERY_SETUP.md](backend/CELERY_SETUP.md) for Celery configuration

## Roadmap

- [ ] Add more job sources (LinkedIn, Glassdoor)
- [ ] Email notifications for job alerts
- [ ] Machine learning for job recommendations
- [ ] Advanced filtering and search
- [ ] Export reports to PDF/Excel
- [ ] User authentication and saved searches
- [ ] API rate limiting and caching
- [ ] Kubernetes deployment configuration
