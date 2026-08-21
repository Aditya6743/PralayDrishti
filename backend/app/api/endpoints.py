from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.database import models, schemas
from app.database.connection import get_db
from app.ai.processor import analyze_report_with_ai
from app.websocket.manager import manager
from app.demo.simulator import run_judge_demo
from datetime import datetime
import json

router = APIRouter()

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.post("/reports", response_model=schemas.ReportResponse)
async def create_report(report_in: schemas.ReportCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_report = models.Report(
        message=report_in.message,
        source=report_in.source,
        location_text=report_in.location_text,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        people_affected=report_in.people_affected,
        image_data=report_in.image_data,
        processing_status="PENDING"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    background_tasks.add_task(process_report_async, db_report.id, db)
    return db_report

async def process_report_async(report_id: str, db: Session):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report: return
    
    ai_res = analyze_report_with_ai(db_report.message, db_report.image_data)
    
    # GEOSPATIAL CLUSTERING: Find incidents within 500 meters (0.5 km)
    import math
    def haversine(lat1, lon1, lat2, lon2):
        if lat1 is None or lon1 is None or lat2 is None or lon2 is None: return float('inf')
        R = 6371 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    incident = None
    rep_lat = db_report.latitude or 19.0760
    rep_lon = db_report.longitude or 72.8777
    
    # 1. Try to find by title first (LLM matching)
    incident = db.query(models.Incident).filter(models.Incident.title == ai_res.incident_cluster_title).first()
    
    # 2. If no title match, check by spatial distance
    if not incident:
        all_incidents = db.query(models.Incident).all()
        for i in all_incidents:
            if i.status in ["NEW", "ACKNOWLEDGED", "RESPONDING"] and haversine(rep_lat, rep_lon, i.latitude, i.longitude) <= 0.5:
                incident = i
                break

    if not incident:
        incident = models.Incident(
            title=ai_res.incident_cluster_title,
            category=ai_res.category,
            severity=ai_res.severity,
            confidence=ai_res.confidence,
            latitude=rep_lat,
            longitude=rep_lon,
            people_affected=ai_res.people_affected
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        te = models.TimelineEvent(
            incident_id=incident.id, 
            description=f"Incident opened via Citizen Report ({ai_res.severity})", 
            event_type="SYSTEM"
        )
        db.add(te)
        db.commit()
    else:
        incident.people_affected += ai_res.people_affected
        incident.updated_at = datetime.utcnow()
        
        # TTC Dynamic Triage logic (Feature 1)
        ttc_multiplier = {"CRITICAL": 15, "HIGH": 60, "MEDIUM": 120, "LOW": 360}
        new_ttc = ttc_multiplier.get(ai_res.severity, 60)
        if new_ttc < incident.ttc_minutes:
            incident.ttc_minutes = new_ttc
            
        if ai_res.severity in ["CRITICAL", "HIGH"]: 
            incident.severity = ai_res.severity # simplify escalation logic for non-demo
        db.commit()
    
    # Feature 5: Survival Guidance
    guidance = "Stay calm and await rescue."
    if ai_res.severity == "CRITICAL" and "water" in ai_res.reasoning.lower():
        guidance = "1. Move to the highest possible ground immediately.\n2. Do not walk through moving water.\n3. Turn off main power if safe."
    elif ai_res.severity == "CRITICAL":
        guidance = "1. Find a safe structural area.\n2. Do not move if injured.\n3. Conserve phone battery."
    
    db_report.category = ai_res.category
    db_report.severity = ai_res.severity
    db_report.confidence = ai_res.confidence
    if ai_res.people_affected > db_report.people_affected:
        db_report.people_affected = ai_res.people_affected
    db_report.ai_reasoning = ai_res.reasoning
    db_report.survival_guidance = guidance
    db_report.requires_human_review = ai_res.requires_human_review
    db_report.detected_language = ai_res.detected_language
    db_report.anomaly_flag = ai_res.anomaly_flag
    db_report.urgency_indicators = json.dumps(ai_res.urgency_indicators)
    db_report.processing_status = "PROCESSED"
    db_report.incident_id = incident.id
    db.commit()
    db.refresh(db_report)
    
    report_dict = {
        "id": db_report.id,
        "ticket_id": db_report.ticket_id,
        "message": db_report.message,
        "source": db_report.source,
        "timestamp": db_report.timestamp.isoformat(),
        "severity": db_report.severity,
        "confidence": db_report.confidence,
        "category": db_report.category,
        "requires_human_review": db_report.requires_human_review,
        "ai_reasoning": db_report.ai_reasoning,
        "survival_guidance": db_report.survival_guidance,
        "detected_language": db_report.detected_language,
        "anomaly_flag": db_report.anomaly_flag,
        "incident_id": db_report.incident_id,
        "processing_status": db_report.processing_status
    }
    await manager.broadcast_report(report_dict)

@router.get("/reports", response_model=List[schemas.ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).order_by(models.Report.timestamp.desc()).limit(100).all()

@router.get("/incidents", response_model=List[schemas.IncidentResponse])
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).order_by(models.Incident.updated_at.desc()).all()
    for i in incidents:
        i.report_count = len(i.reports)
    return incidents

@router.get("/incidents/{incident_id}", response_model=schemas.IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident: raise HTTPException(404)
    incident.report_count = len(incident.reports)
    # Ensure timeline is sorted safely
    if hasattr(incident, 'timeline') and incident.timeline:
        incident.timeline.sort(key=lambda x: x.timestamp or datetime.min, reverse=True)
    return incident

@router.put("/incidents/{incident_id}/status")
async def update_incident_status(incident_id: str, status: str, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident: raise HTTPException(404)
    
    old_status = incident.status
    incident.status = status
    incident.updated_at = datetime.utcnow()
    
    te = models.TimelineEvent(
        incident_id=incident.id, 
        description=f"Status changed from {old_status} to {status}", 
        event_type="OPERATOR"
    )
    db.add(te)
    db.commit()
    db.refresh(incident)
    
    await manager.broadcast_incident({
        "id": incident.id,
        "title": incident.title,
        "severity": incident.severity,
        "status": incident.status,
        "people_affected": incident.people_affected,
        "updated_at": incident.updated_at.isoformat()
    })
    return {"status": "success"}

@router.get("/review", response_model=List[schemas.ReportResponse])
def get_review_queue(db: Session = Depends(get_db)):
    return db.query(models.Report).filter(models.Report.requires_human_review == True).all()

@router.post("/review/{report_id}")
async def submit_review(report_id: str, action: schemas.ReviewAction, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report: raise HTTPException(404)
        
    review = models.HumanReview(
        report_id=report.id,
        original_prediction=report.severity,
        final_prediction=action.final_prediction,
        reviewer_action=action.reviewer_action,
        reviewer_notes=action.reviewer_notes
    )
    db.add(review)
    report.severity = action.final_prediction
    report.requires_human_review = False
    
    # Also update incident if escalated
    if report.incident_id:
        incident = db.query(models.Incident).filter(models.Incident.id == report.incident_id).first()
        if incident:
            te = models.TimelineEvent(
                incident_id=incident.id, 
                description=f"Operator {action.reviewer_action} report severity to {action.final_prediction}", 
                event_type="OPERATOR"
            )
            db.add(te)
            if action.final_prediction == "CRITICAL":
                incident.severity = "CRITICAL"
            
    db.commit()
    return {"status": "Review accepted"}

@router.post("/demo/start")
def start_demo(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(run_judge_demo, db)
    return {"status": "Simulation started"}

@router.post("/demo/reset")
async def reset_demo(db: Session = Depends(get_db)):
    # Delete all demo data
    db.query(models.Notification).filter(models.Notification.is_demo == True).delete()
    db.query(models.TimelineEvent).filter(models.TimelineEvent.is_demo == True).delete()
    db.query(models.Report).filter(models.Report.is_demo == True).delete()
    db.query(models.Incident).filter(models.Incident.is_demo == True).delete()
    db.commit()
    
    # Notify clients to refresh
    await manager.broadcast("RESET", {})
    return {"status": "Demo reset successful"}

@router.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.timestamp.desc()).limit(20).all()

@router.get("/search")
def global_search(q: str, db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(or_(
        models.Report.message.ilike(f"%{q}%"),
        models.Report.category.ilike(f"%{q}%"),
        models.Report.id.ilike(f"%{q}%")
    )).limit(10).all()
    
    incidents = db.query(models.Incident).filter(or_(
        models.Incident.title.ilike(f"%{q}%"),
        models.Incident.id.ilike(f"%{q}%")
    )).limit(10).all()
    
    return {
        "reports": [{"id": r.id, "text": r.message, "type": "Report", "severity": r.severity} for r in reports],
        "incidents": [{"id": i.id, "text": i.title, "type": "Incident", "severity": i.severity} for i in incidents]
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total_reports = db.query(models.Report).count()
    critical = db.query(models.Report).filter(models.Report.severity == "CRITICAL").count()
    high = db.query(models.Report).filter(models.Report.severity == "HIGH").count()
    pending_review = db.query(models.Report).filter(models.Report.requires_human_review == True).count()
    
    incidents = db.query(models.Incident).all()
    people = sum([i.people_affected for i in incidents if i.people_affected])
    resolved = db.query(models.Incident).filter(models.Incident.status == "RESOLVED").count()
    
    return {
        "reports_processed": total_reports,
        "critical": critical,
        "high": high,
        "awaiting_review": pending_review,
        "people_affected": people,
        "incidents_resolved": resolved
    }
