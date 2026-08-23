from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from frontend.api.app.database import models

DATABASE_URL = "postgresql://postgres.feegfdvcfmzmgvwmziya:Elicit%23%232026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
engine = create_engine(DATABASE_URL, poolclass=NullPool)

print("Dropping all tables...")
models.Base.metadata.drop_all(bind=engine)
print("Recreating all tables...")
models.Base.metadata.create_all(bind=engine)
print("Done! Database schema is now perfect.")
