from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from frontend.api.app.database import models
from frontend.api.app.database.connection import SessionLocal

DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
engine = create_engine(DATABASE_URL, poolclass=NullPool)

db = SessionLocal()
incidents = db.query(models.Incident).all()
print("Total incidents in live DB:", len(incidents))
