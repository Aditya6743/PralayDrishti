from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import models, schemas
from app.database.connection import get_db
import base64
import json
import math
from difflib import SequenceMatcher

router = APIRouter()

def haversine(lat1, lon1, lat2, lon2):
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None: return float('inf')
    R = 6371 # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# 2. Low-Bandwidth Micro-Payload Reporting
@router.get("/ingest")
async def ingest_payload(d: str, db: Session = Depends(get_db)):
    # Payload format: Base64(JSON({m: message, l: location, p: people, lat: lat, lon: lon}))
    try:
        decoded = base64.b64decode(d).decode('utf-8')
        payload = json.loads(decoded)
        
        db_report = models.Report(
            message=payload.get("m", "Emergency"),
            source="SMS/Lite",
            location_text=payload.get("l", ""),
            latitude=payload.get("lat"),
            longitude=payload.get("lon"),
            people_affected=payload.get("p", 1),
            processing_status="PENDING"
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        # Trigger background processing... (we'll just return success for the lite version)
        return {"status": "success", "ticket": db_report.ticket_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 6. Reverse Status Channel
@router.get("/status/{ticket_id}")
def get_status(ticket_id: str, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.ticket_id == ticket_id).first()
    if not report: raise HTTPException(404, detail="Ticket not found")
    
    incident = None
    if report.incident_id:
        incident = db.query(models.Incident).filter(models.Incident.id == report.incident_id).first()
        
    return {
        "ticket_id": report.ticket_id,
        "processing_status": report.processing_status,
        "survival_guidance": report.survival_guidance,
        "incident_status": incident.status if incident else "VERIFYING",
        "severity": report.severity
    }

# 3. Shelter Matching
@router.get("/shelters/match")
def match_shelter(lat: float, lon: float, people: int = 1, db: Session = Depends(get_db)):
    shelters = db.query(models.Shelter).all()
    best_shelter = None
    min_dist = float('inf')
    
    for s in shelters:
        avail = s.capacity - s.current_occupancy
        if avail >= people:
            dist = haversine(lat, lon, s.latitude, s.longitude)
            if dist < min_dist:
                min_dist = dist
                best_shelter = s
                
    if not best_shelter:
        raise HTTPException(status_code=404, detail="No suitable shelters available")
        
    # Atomic decrement
    best_shelter.current_occupancy += people
    db.commit()
    
    return {
        "shelter_id": best_shelter.id,
        "name": best_shelter.name,
        "distance_km": round(min_dist, 2),
        "available_capacity": best_shelter.capacity - best_shelter.current_occupancy
    }

# 4. Missing/Found Persons Linker
@router.post("/missing")
def report_missing(person: schemas.MissingPersonCreate, db: Session = Depends(get_db)):
    db_person = models.MissingPerson(
        name=person.name, description=person.description, contact_phone=person.contact_phone
    )
    db.add(db_person)
    db.commit()
    return {"status": "logged", "id": db_person.id}

@router.post("/found")
def report_found(person: schemas.FoundPersonCreate, db: Session = Depends(get_db)):
    missing_persons = db.query(models.MissingPerson).filter(models.MissingPerson.status == "MISSING").all()
    best_match = None
    highest_score = 0.0
    
    # Simple naive similarity matching (Substitute for pgvector in hackathon)
    for m in missing_persons:
        score = SequenceMatcher(None, m.description.lower(), person.description.lower()).ratio()
        if score > highest_score:
            highest_score = score
            best_match = m
            
    db_found = models.FoundPerson(description=person.description, location=person.location)
    
    if best_match and highest_score > 0.5:
        db_found.matched_missing_id = best_match.id
        best_match.status = "FOUND"
        db.add(db_found)
        db.commit()
        return {"status": "match_found", "missing_person": best_match.name, "confidence": round(highest_score * 100, 2)}
        
    db.add(db_found)
    db.commit()
    return {"status": "logged", "message": "No match found yet"}
