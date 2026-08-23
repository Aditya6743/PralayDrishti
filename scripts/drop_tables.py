from sqlalchemy import create_engine
from frontend.api.app.database.models import Base

DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
engine = create_engine(DATABASE_URL)

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Recreating all tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
