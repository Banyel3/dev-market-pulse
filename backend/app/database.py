from sqlmodel import SQLModel, create_engine, Session
from app.config import get_settings

settings = get_settings()

# Use sync postgres driver for SQLModel compatibility
# Replace asyncpg with psycopg for sync operations
database_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg://")

engine = create_engine(
    database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)


def init_db():
    """Create all tables in the database."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session
