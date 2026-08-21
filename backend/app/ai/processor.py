import os
import json
import google.generativeai as genai
from app.database.schemas import AIAnalysisResult
import random

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. Using Fallback Demo AI.")

def detect_anomaly(text: str) -> bool:
    # Basic heuristic false report detection
    text_lower = text.lower()
    spam_words = ["test", "fake", "joke", "prank", "ignore this"]
    if any(word in text_lower for word in spam_words):
        return True
    return False

def analyze_report_with_ai(text: str, image_data: str = None) -> AIAnalysisResult:
    if not model:
        return _fallback_ai(text, image_data)
        
    prompt = f"""
    You are the AI brain of PralayDrishti, an emergency operations center.
    Analyze the disaster report (and the attached image if provided) and output ONLY a valid JSON object matching exactly this schema:
    
    {{
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "confidence": float (0.0 to 1.0),
      "category": "Flood" | "Fire" | "Building Collapse" | "Medical Emergency" | "Trapped" | "Road Blockage" | "Missing Person" | "Infrastructure Damage" | "Other",
      "summary": "1-2 sentence concise summary",
      "location": "extracted location or 'Unknown'",
      "people_affected": integer (0 if none mentioned),
      "urgency_indicators": ["list", "of", "keywords", "detected"],
      "reasoning": "Explain step-by-step why this severity was chosen.",
      "requires_human_review": boolean (true if confidence < 0.75, if phrasing is highly ambiguous, or if unseen slang is used),
      "incident_cluster_title": "A short, normalized event title to group duplicates (e.g. 'Sector 12 Building Collapse')",
      "detected_language": "English" | "Hindi" | "Hinglish" | "Other"
    }}

    IMPORTANT RULES:
    - Determine severity intelligently: Trapped people, collapse, or fast-rising water = CRITICAL. Blocked roads = LOW/MEDIUM.
    - If the input uses unusual slang or ambiguous phrasing (e.g., "Paani gardan tak aa gaya"), reduce confidence to < 0.70 to force human review.
    - If an image is provided, analyze it to determine objective severity (e.g., water level, fire size).
    - Output ONLY JSON. Do not use markdown blocks.

    Report: "{text}"
    """
    
    contents = [prompt]
    if image_data:
        try:
            import base64
            # Usually data:image/jpeg;base64,...
            if "," in image_data:
                mime_part, b64_data = image_data.split(",", 1)
                mime_type = mime_part.split(":")[1].split(";")[0]
            else:
                b64_data = image_data
                mime_type = "image/jpeg"
                
            contents.append({
                "mime_type": mime_type,
                "data": base64.b64decode(b64_data)
            })
        except Exception as e:
            print(f"Error parsing image: {e}")
    
    try:
        response = model.generate_content(contents, generation_config={"response_mime_type": "application/json"})
        data = json.loads(response.text)
        
        confidence = float(data.get("confidence", 0.8))
        requires_review = data.get("requires_human_review", confidence < 0.75)
        
        return AIAnalysisResult(
            severity=data.get("severity", "MEDIUM"),
            confidence=confidence,
            category=data.get("category", "Other"),
            summary=data.get("summary", "No summary provided."),
            location=data.get("location", "Unknown"),
            people_affected=int(data.get("people_affected", 0)),
            urgency_indicators=data.get("urgency_indicators", []),
            reasoning=data.get("reasoning", "AI classification successful."),
            requires_human_review=requires_review,
            incident_cluster_title=data.get("incident_cluster_title", "Uncategorized Incident"),
            detected_language=data.get("detected_language", "English"),
            anomaly_flag=detect_anomaly(text)
        )
    except Exception as e:
        print(f"AI Error: {e}")
        return _fallback_ai(text)

def _fallback_ai(text: str, image_data: str = None) -> AIAnalysisResult:
    text_lower = text.lower()
    
    severity = "LOW"
    confidence = random.uniform(0.7, 0.95)
    category = "Other"
    people = 0
    requires_review = False
    language = "English"
    
    if image_data:
        severity = "HIGH"
        category = "Visual Confirmation"
        confidence = 0.95
    
    if "trapped" in text_lower or "phas gaye" in text_lower or "collapse" in text_lower:
        severity = "CRITICAL"
        category = "Trapped"
        people = 5
    elif "water" in text_lower or "paani" in text_lower or "flood" in text_lower:
        severity = "HIGH"
        category = "Flood"
    elif "fire" in text_lower or "aag" in text_lower:
        severity = "CRITICAL"
        category = "Fire"
    elif "block" in text_lower or "traffic" in text_lower:
        severity = "LOW"
        category = "Road Blockage"
        
    if "shayad" in text_lower or "may be" in text_lower:
        confidence = random.uniform(0.4, 0.6)
        requires_review = True
        
    if "hai" in text_lower or "gaye" in text_lower or "paani" in text_lower:
        language = "Hinglish"
        
    reasoning = []
    if people > 0: reasoning.append(f"{people} people affected.")
    if severity == "CRITICAL": reasoning.append("Immediate threat to life detected.")
    if requires_review: reasoning.append("Ambiguous phrasing reduced confidence.")
        
    return AIAnalysisResult(
        severity=severity,
        confidence=confidence,
        category=category,
        summary=f"Analyzed: {text}",
        location="Demo Location",
        people_affected=people,
        urgency_indicators=["demo", "fallback"],
        reasoning=" ".join(reasoning) or "Standard classification.",
        requires_human_review=requires_review,
        incident_cluster_title="Demo Incident",
        detected_language=language,
        anomaly_flag=detect_anomaly(text)
    )
