from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    category = Column(String)
    severity = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    confidence = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    people_affected = Column(Integer, default=0)
    status = Column(String, default="NEW") # NEW, ACKNOWLEDGED, RESPONDING, RESOLVED
    is_demo = Column(Boolean, default=False)
    ttc_minutes = Column(Integer, default=60) # Time-to-Criticality
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    reports = relationship("Report", back_populates="incident", cascade="all, delete-orphan")
    timeline = relationship("TimelineEvent", back_populates="incident", cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    ticket_id = Column(String, default=lambda: "PD-" + str(uuid.uuid4())[:8].upper())
    message = Column(Text, nullable=False)
    source = Column(String, default="Web")
    timestamp = Column(DateTime, default=datetime.utcnow)
    latitude = Column(Float)
    longitude = Column(Float)
    location_text = Column(String)
    category = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    people_affected = Column(Integer, default=0)
    ai_reasoning = Column(Text)
    survival_guidance = Column(Text)
    urgency_indicators = Column(String) # JSON list as string
    detected_language = Column(String, default="English")
    anomaly_flag = Column(Boolean, default=False)
    is_demo = Column(Boolean, default=False)
    image_data = Column(Text, nullable=True)
    processing_status = Column(String, default="PROCESSED") # PENDING, PROCESSED
    requires_human_review = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=True)
    incident = relationship("Incident", back_populates="reports")
    reviews = relationship("HumanReview", back_populates="report", cascade="all, delete-orphan")

class Shelter(Base):
    __tablename__ = "shelters"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    capacity = Column(Integer, default=100)
    current_occupancy = Column(Integer, default=0)
    medical_supplies = Column(Boolean, default=True)

class MissingPerson(Base):
    __tablename__ = "missing_persons"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    description = Column(Text)
    contact_phone = Column(String)
    status = Column(String, default="MISSING")
    created_at = Column(DateTime, default=datetime.utcnow)

class FoundPerson(Base):
    __tablename__ = "found_persons"
    id = Column(String, primary_key=True, default=generate_uuid)
    description = Column(Text)
    location = Column(String)
    matched_missing_id = Column(String, ForeignKey("missing_persons.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    id = Column(String, primary_key=True, default=generate_uuid)
    incident_id = Column(String, ForeignKey("incidents.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    description = Column(String, nullable=False)
    event_type = Column(String) # SYSTEM, OPERATOR, AI
    is_demo = Column(Boolean, default=False)
    
    incident = relationship("Incident", back_populates="timeline")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=generate_uuid)
    message = Column(String, nullable=False)
    type = Column(String, default="INFO") # ALERT, WARNING, INFO, SUCCESS
    is_read = Column(Boolean, default=False)
    is_demo = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class HumanReview(Base):
    __tablename__ = "human_reviews"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    report_id = Column(String, ForeignKey("reports.id"))
    original_prediction = Column(String)
    final_prediction = Column(String)
    reviewer_action = Column(String) # CONFIRMED, CHANGED, FALSE_POSITIVE
    reviewer_notes = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    report = relationship("Report", back_populates="reviews")

class Operator(Base):
    __tablename__ = "operators"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    role = Column(String, default="OPERATOR")
