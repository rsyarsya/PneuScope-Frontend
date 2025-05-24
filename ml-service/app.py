from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(
    title="PneuScope ML Service",
    description="Machine Learning API for broncopneumonia risk assessment",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AudioData(BaseModel):
    audio: List[float]

class PredictionResponse(BaseModel):
    risk_score: float
    confidence: float
    analysis: dict

@app.get("/")
async def root():
    return {"message": "PneuScope ML Service", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "ml-service"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_risk(data: AudioData):
    """
    Predict broncopneumonia risk based on chest audio data.
    
    In production, this would use a trained ML model.
    For this prototype, we use rule-based logic.
    """
    try:
        audio_array = np.array(data.audio)
        
        if len(audio_array) == 0:
            raise HTTPException(status_code=400, detail="No audio data provided")
        
        # PROTOTYPE: Simple rule-based risk assessment
        # In production, replace with trained ML model
        risk_score = calculate_prototype_risk(audio_array)
        
        # Calculate confidence based on data quality
        confidence = calculate_confidence(audio_array)
        
        # Detailed analysis
        analysis = perform_audio_analysis(audio_array)
        
        return PredictionResponse(
            risk_score=risk_score,
            confidence=confidence,
            analysis=analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

def calculate_prototype_risk(audio_data: np.ndarray) -> float:
    """
    PROTOTYPE FUNCTION: Simple rule-based risk calculation.
    
    In production, this would be replaced with a trained ML model
    that analyzes spectral features, breathing patterns, etc.
    """
    
    # Basic statistical features
    mean_level = np.mean(audio_data)
    max_level = np.max(audio_data)
    std_level = np.std(audio_data)
    
    # Rule-based risk factors
    risk_factors = []
    
    # High decibel levels may indicate abnormal sounds
    if max_level > 60:
        risk_factors.append(0.4)
    elif max_level > 45:
        risk_factors.append(0.2)
    
    # High variability may indicate irregular breathing
    if std_level > 15:
        risk_factors.append(0.3)
    elif std_level > 10:
        risk_factors.append(0.15)
    
    # Sustained high levels
    high_level_count = np.sum(audio_data > 50)
    if high_level_count > len(audio_data) * 0.3:  # More than 30% high levels
        risk_factors.append(0.35)
    elif high_level_count > len(audio_data) * 0.15:  # More than 15% high levels
        risk_factors.append(0.2)
    
    # Calculate final risk score
    base_risk = min(mean_level / 100, 0.3)  # Base risk from average level
    additional_risk = sum(risk_factors)
    
    total_risk = min(base_risk + additional_risk, 1.0)
    
    return round(total_risk, 3)

def calculate_confidence(audio_data: np.ndarray) -> float:
    """Calculate confidence score based on data quality."""
    
    # More data points = higher confidence
    data_quality = min(len(audio_data) / 100, 1.0)
    
    # Consistent data = higher confidence
    consistency = 1.0 - min(np.std(audio_data) / np.mean(audio_data), 1.0)
    
    confidence = (data_quality + consistency) / 2
    return round(confidence, 3)

def perform_audio_analysis(audio_data: np.ndarray) -> dict:
    """Perform detailed audio analysis."""
    
    return {
        "total_samples": len(audio_data),
        "duration_seconds": len(audio_data) / 5,  # Assuming 5 samples per second
        "statistics": {
            "mean_db": round(np.mean(audio_data), 2),
            "max_db": round(np.max(audio_data), 2),
            "min_db": round(np.min(audio_data), 2),
            "std_db": round(np.std(audio_data), 2)
        },
        "anomaly_indicators": {
            "high_amplitude_events": int(np.sum(audio_data > 60)),
            "amplitude_variability": "high" if np.std(audio_data) > 15 else "normal",
            "sustained_abnormal_sounds": int(np.sum(audio_data > 50))
        },
        "recommendations": generate_recommendations(audio_data)
    }

def generate_recommendations(audio_data: np.ndarray) -> List[str]:
    """Generate clinical recommendations based on analysis."""
    
    recommendations = []
    
    max_level = np.max(audio_data)
    std_level = np.std(audio_data)
    high_count = np.sum(audio_data > 50)
    
    if max_level > 70:
        recommendations.append("Immediate clinical evaluation recommended")
        recommendations.append("Consider chest X-ray or CT scan")
    elif max_level > 55:
        recommendations.append("Monitor closely for 24-48 hours")
        recommendations.append("Consider follow-up examination")
    
    if std_level > 20:
        recommendations.append("Irregular breathing pattern detected")
        recommendations.append("Assess for respiratory distress")
    
    if high_count > len(audio_data) * 0.4:
        recommendations.append("Persistent abnormal sounds detected")
        recommendations.append("Consider antibiotic therapy evaluation")
    
    if not recommendations:
        recommendations.append("Continue routine monitoring")
        recommendations.append("Normal breathing patterns observed")
    
    return recommendations

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENV") == "development" else False
    )
