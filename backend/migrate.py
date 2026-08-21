import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database.connection import engine
from app.database.models import Base

def migrate():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE incidents ADD COLUMN ttc_minutes INTEGER DEFAULT 60;"))
        except Exception as e:
            pass
        
        try:
            conn.execute(text("ALTER TABLE reports ADD COLUMN ticket_id VARCHAR;"))
            conn.execute(text("ALTER TABLE reports ADD COLUMN survival_guidance TEXT;"))
        except Exception as e:
            pass

    print("Migration complete to:", engine.url)

if __name__ == "__main__":
    migrate()
