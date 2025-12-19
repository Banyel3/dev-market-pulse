"""
Start Celery worker to process tasks.
Run: python -m app.worker
"""

from app.celery_app import celery_app

if __name__ == '__main__':
    celery_app.worker_main([
        'worker',
        '--loglevel=info',
        '--pool=solo',  # Use solo pool for Windows compatibility
        '--concurrency=1',
    ])
