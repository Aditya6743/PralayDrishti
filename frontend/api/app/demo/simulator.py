import asyncio
import random
from sqlalchemy.orm import Session
from app.database import models
from app.database.connection import SessionLocal
from datetime import datetime

judge_demo_reports = [
    "Traffic is moving slowly near the toll plaza.",
    "Small puddle forming on 4th street.",
    "Road is slightly blocked by a fallen branch.",
    "Need someone to clear the drain.",
    "Power went out for 10 minutes.",
    "Water has entered our house.",
    "Paani second floor tak aa gaya hai.",
    "Road completely blocked near the bridge, cars are stuck in water.",
    "We're trapped on the second floor, 5 people.",
    "Hum building me phas gaye hain, Sector 12.",
    "5 civilians trapped inside a flooded residential building in Sector 12.",
    "Aag lag gayi hai factory me!",
    "Massive fire at the industrial park, 10 workers missing.",
    "Water is getting bad around the old building and people may be stuck.",
    "Shayad log phase hain purani building ke paas.",
    "Paani gardan tak aa gaya aur bahar nahi nikal paa rahe.",
    "This is a test message ignore.",
    "fake prank call lol",
]

async def trigger_notification(db: Session, message: str, type: str = "INFO"):
    notif = models.Notification(message=message, type=type, is_demo=True)
    db.add(notif)
    db.commit()
    db.refresh(notif)

async def run_judge_demo():
    db = SessionLocal()
    try:
        await trigger_notification(db, "JUDGE DEMO INITIATED: Generating 50 reports...", "WARNING")
        
        reports_to_generate = []
        for _ in range(50):
            reports_to_generate.append(random.choice(judge_demo_reports))
            
        for idx, text in enumerate(reports_to_generate):
            category = "FLOOD" if "paani" in text.lower() or "water" in text.lower() else "STRUCTURAL"
            severity = "CRITICAL" if "trapped" in text.lower() or "phas" in text.lower() else "HIGH"
            confidence = random.uniform(0.85, 0.99)
            locations = ["Andheri", "Bandra", "Sector 12", "Dharavi", "Colaba", "Borivali", "Juhu", "Powai", "Goregaon", "Malad", "Worli", "Dadar", "Kurla", "Vashi", "Thane"]
            loc = random.choice(locations)
            incident_cluster_title = f"{category.capitalize()} at {loc} - Zone {random.randint(1, 10)}"
            people_affected = random.randint(1, 5)
            
            lat = 19.0760 + random.uniform(-0.1, 0.1)
            lng = 72.8777 + random.uniform(-0.1, 0.1)
            
            incident = models.Incident(
                title=incident_cluster_title,
                category=category,
                severity=severity,
                confidence=confidence,
                latitude=lat,
                longitude=lng,
                people_affected=people_affected,
                is_demo=True
            )
            db.add(incident)

        db.commit()
        await trigger_notification(db, "DEMO GENERATION COMPLETE", "INFO")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
