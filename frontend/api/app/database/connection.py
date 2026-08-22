import os
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker
from .models import Base

# Fallback to local SQLite if Postgres is not configured
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    if os.getenv("USER") == "aditya":  # Local Mac environment
        DATABASE_URL = "sqlite:///../../pralaydrishti.db"
    else:  # Vercel / Production
        DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:CodeBlooded%40123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# Add connect_args for SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, poolclass=NullPool if "postgres" in DATABASE_URL else None)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
