import os
import json
import random
import requests
from app.database.schemas import AIAnalysisResult

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def detect_anomaly(text: str) -> bool:
    text_lower = text.lower()
    spam_words = ["test", "fake", "joke", "prank", "ignore this"]
    return any(word in text_lower for word in spam_words)

def analyze_report_with_ai(text: str, image_data: str = None) -> AIAnalysisResult:
    if not GEMINI_API_KEY:
        return _fallback_ai(text, image_data)
        
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": f"You are an emergency AI. Analyze this disaster report: {text}. Output JSON with category, severity (CRITICAL, HIGH, MEDIUM, LOW), confidence, people_affected."}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        res = requests.post(url, json=payload, timeout=5)
        if res.status_code == 200:
            data = json.loads(res.json()["candidates"][0]["content"]["parts"][0]["text"])
            return AIAnalysisResult(
                category=data.get("category", "UNKNOWN"),
                severity=data.get("severity", "HIGH"),
                confidence=float(data.get("confidence", 0.9)),
                people_affected=int(data.get("people_affected", 1)),
                reasoning="Gemini REST API Analysis",
                urgency_indicators=[],
                detected_language="en",
                anomaly_flag=False,
                requires_human_review=False
            )
    except Exception as e:
        print(f"Gemini REST error: {e}")
        
    return _fallback_ai(text, image_data)

def _fallback_ai(text: str, image_data: str = None) -> AIAnalysisResult:
    text_lower = text.lower()
    severity = "LOW"
    confidence = random.uniform(0.7, 0.95)
    category = "Other"
    people = 1
    
    if "trapped" in text_lower or "phas gaye" in text_lower:
        severity = "CRITICAL"
        category = "Trapped"
        people = 5
    elif "water" in text_lower or "paani" in text_lower or "flood" in text_lower:
        severity = "HIGH"
        category = "Flood"
        
    return AIAnalysisResult(
        category=category,
        severity=severity,
        confidence=confidence,
        people_affected=people,
        reasoning="Heuristic fallback applied.",
        urgency_indicators=[],
        detected_language="en",
        anomaly_flag=False,
        requires_human_review=False
    )
