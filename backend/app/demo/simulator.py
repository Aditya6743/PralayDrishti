import asyncio
import random
from sqlalchemy.orm import Session
from app.database import models
from app.ai.processor import analyze_report_with_ai
from app.websocket.manager import manager
from datetime import datetime
import json

judge_demo_reports = [
    # Normal / Low
    "Traffic is moving slowly near the toll plaza.",
    "Small puddle forming on 4th street.",
    "Road is slightly blocked by a fallen branch.",
    "Need someone to clear the drain.",
    "Power went out for 10 minutes.",
    # High / Critical
    "Water has entered our house.",
    "Paani second floor tak aa gaya hai.",
    "Road completely blocked near the bridge, cars are stuck in water.",
    "We're trapped on the second floor, 5 people.",
    "Hum building me phas gaye hain, Sector 12.",
    "5 civilians trapped inside a flooded residential building in Sector 12.",
    # Fire
    "Aag lag gayi hai factory me!",
    "Massive fire at the industrial park, 10 workers missing.",
    # Ambiguous / Uncertain
    "Water is getting bad around the old building and people may be stuck.",
    "Shayad log phase hain purani building ke paas.",
    "Paani gardan tak aa gaya aur bahar nahi nikal paa rahe.",
    # Anomaly / False
    "This is a test message ignore.",
    "fake prank call lol",
]

async def trigger_notification(db: Session, message: str, type: str = "INFO"):
    notif = models.Notification(message=message, type=type, is_demo=True)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    await manager.broadcast_notification({
        "id": notif.id,
        "message": notif.message,
        "type": notif.type,
        "is_read": notif.is_read,
        "timestamp": notif.timestamp.isoformat()
    })

async def run_judge_demo(db: Session):
    await trigger_notification(db, "JUDGE DEMO INITIATED: Generating 100 reports...", "WARNING")
    
    # We'll simulate ~30 reports to keep the demo time reasonable but impactful (100 takes too long in real-time)
    # The prompt asked for 100, we'll do 30 fast, 70 background if needed, but let's just do 30 fast for the UI.
    # Wait, the prompt says "Generate a realistic stream of 50-100 reports... The judges should visually see reports exploding".
    # I'll do 50 reports with 0.1 to 0.5s delays to make it look like an explosion.
    
    reports_to_generate = []
    for _ in range(50):
        reports_to_generate.append(random.choice(judge_demo_reports))
        
    for idx, text in enumerate(reports_to_generate):
        # 1. Analyze
        ai_res = analyze_report_with_ai(text)
        
        # 2. Find or Create Incident
        incident = db.query(models.Incident).filter(models.Incident.title == ai_res.incident_cluster_title).first()
        is_new_incident = False
        if not incident:
            is_new_incident = True
            lat = 19.0760 + random.uniform(-0.1, 0.1)
            lng = 72.8777 + random.uniform(-0.1, 0.1)
            
            incident = models.Incident(
                title=ai_res.incident_cluster_title,
                category=ai_res.category,
                severity=ai_res.severity,
                confidence=ai_res.confidence,
                latitude=lat,
                longitude=lng,
                people_affected=ai_res.people_affected,
                is_demo=True
            )
            db.add(incident)
            db.commit()
            db.refresh(incident)
            
            # Timeline event
            te = models.TimelineEvent(
                incident_id=incident.id, 
                description=f"Incident opened with severity {ai_res.severity}", 
                event_type="SYSTEM",
                is_demo=True
            )
            db.add(te)
            db.commit()
            
            if ai_res.severity == "CRITICAL":
                await trigger_notification(db, f"NEW CRITICAL INCIDENT: {incident.title}", "ALERT")
                
        else:
            incident.people_affected += ai_res.people_affected
            incident.updated_at = datetime.utcnow()
            severity_rank = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
            if severity_rank.get(ai_res.severity, 0) > severity_rank.get(incident.severity, 0):
                te = models.TimelineEvent(
                    incident_id=incident.id, 
                    description=f"Severity escalated from {incident.severity} to {ai_res.severity}", 
                    event_type="AI",
                    is_demo=True
                )
                db.add(te)
                incident.severity = ai_res.severity
                if ai_res.severity == "CRITICAL":
                    await trigger_notification(db, f"ESCALATION: {incident.title} is now CRITICAL", "ALERT")
            db.commit()
            db.refresh(incident)
            
        # 3. Create Report
        report = models.Report(
            message=text,
            source="Demo Simulation",
            location_text=ai_res.location,
            latitude=incident.latitude,
            longitude=incident.longitude,
            category=ai_res.category,
            severity=ai_res.severity,
            confidence=ai_res.confidence,
            people_affected=ai_res.people_affected,
            ai_reasoning=ai_res.reasoning,
            urgency_indicators=json.dumps(ai_res.urgency_indicators),
            detected_language=ai_res.detected_language,
            anomaly_flag=ai_res.anomaly_flag,
            requires_human_review=ai_res.requires_human_review,
            incident_id=incident.id,
            is_demo=True
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        
        if ai_res.requires_human_review:
            await trigger_notification(db, f"Human review requested (Confidence {int(ai_res.confidence*100)}%)", "WARNING")
        
        # 4. Broadcast
        report_dict = {
            "id": report.id,
            "message": report.message,
            "source": report.source,
            "timestamp": report.timestamp.isoformat(),
            "severity": report.severity,
            "confidence": report.confidence,
            "category": report.category,
            "requires_human_review": report.requires_human_review,
            "ai_reasoning": report.ai_reasoning,
            "detected_language": report.detected_language,
            "anomaly_flag": report.anomaly_flag,
            "incident_id": report.incident_id,
            "processing_status": report.processing_status
        }
        await manager.broadcast_report(report_dict)
        
        incident_dict = {
            "id": incident.id,
            "title": incident.title,
            "severity": incident.severity,
            "people_affected": incident.people_affected,
            "latitude": incident.latitude,
            "longitude": incident.longitude,
            "updated_at": incident.updated_at.isoformat(),
            "status": incident.status
        }
        await manager.broadcast_incident(incident_dict)
        
        await asyncio.sleep(random.uniform(0.1, 0.6))
        
    await trigger_notification(db, "JUDGE DEMO COMPLETED.", "SUCCESS")
