from sqlmodel import Session, select
from app.database import engine
from app.models import JobPosting, Company

session = Session(engine)
recent_jobs = session.exec(
    select(JobPosting)
    .where(JobPosting.source.in_(['indeed', 'remoteok']))
    .order_by(JobPosting.created_at.desc())
    .limit(5)
).all()

print('\n🆕 LATEST REAL JOB POSTINGS:')
for j in recent_jobs:
    company_name = "Unknown"
    if j.company_id:
        company = session.get(Company, j.company_id)
        if company:
            company_name = company.name
    print(f'- {j.title} at {company_name} ({j.source})')

session.close()
