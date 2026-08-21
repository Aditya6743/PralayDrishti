from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReportCreate(BaseModel):
    message: str
    source: Optional[str] = "Web"
    location_text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    people_affected: Optional[int] = 0
    image_data: Optional[str] = None

class AIAnalysisResult(BaseModel):
    severity: str # CRITICAL, HIGH, MEDIUM, LOW
    confidence: float
    category: str
    summary: str
    location: str
    people_affected: int
    urgency_indicators: List[str]
    reasoning: str
    requires_human_review: bool
    incident_cluster_title: str
    detected_language: str
    anomaly_flag: bool

class ReportResponse(BaseModel):
    id: str
    ticket_id: Optional[str] = None
    message: str
    source: str
    timestamp: datetime
    severity: Optional[str] = None
    confidence: Optional[float] = None
    category: Optional[str] = None
    requires_human_review: Optional[bool] = False
    ai_reasoning: Optional[str] = None
    survival_guidance: Optional[str] = None
    urgency_indicators: Optional[str] = None
    detected_language: Optional[str] = "English"
    anomaly_flag: Optional[bool] = False
    incident_id: Optional[str] = None
    processing_status: str

    class Config:
        from_attributes = True

class TimelineEventResponse(BaseModel):
    id: str
    timestamp: datetime
    description: str
    event_type: str

    class Config:
        from_attributes = True

class IncidentResponse(BaseModel):
    id: str
    title: str
    category: Optional[str]
    severity: str
    confidence: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    people_affected: int
    status: str
    ttc_minutes: int
    report_count: int = 0
    created_at: datetime
    updated_at: datetime
    reports: List[ReportResponse] = []
    timeline: List[TimelineEventResponse] = []

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    message: str
    type: str
    is_read: bool
    timestamp: datetime

    class Config:
        from_attributes = True

class ReviewAction(BaseModel):
    final_prediction: str
    reviewer_action: str
    reviewer_notes: Optional[str] = None

class ShelterResponse(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity: int
    current_occupancy: int
    medical_supplies: bool

    class Config:
        from_attributes = True

class MissingPersonCreate(BaseModel):
    name: str
    description: str
    contact_phone: str

class FoundPersonCreate(BaseModel):
    description: str
    location: str
