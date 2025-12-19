"""
Start Celery beat scheduler for periodic tasks.
Run: python -m app.beat
"""

from app.celery_app import celery_app

if __name__ == '__main__':
    celery_app.start(['beat', '--loglevel=info'])
