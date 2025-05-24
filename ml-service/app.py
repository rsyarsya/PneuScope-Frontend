from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import uvicorn
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="PneuScope ML Service",
    description="ML microservice for PneuScope application - Early detection of bronchopneumonia",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request models
class AudioData(BaseModel):
    audio: List[float]

class PredictionResponse(BaseModel):
    risk_score: float
    confidence: float
    analysis: dict

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok", 
        "message": "PneuScope ML Service is running",
        "version": "1.0.0",
        "service": "ml-inference"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "service": "pneuscope-ml",
        "version": "1.0.0",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: AudioData):
    """
    Predict bronchopneumonia risk from audio data
    
    This is a prototype implementation that uses a simple rule-based model.
    In a production system, this would be replaced with a trained ML model
    using techniques like:
    - Mel-frequency cepstral coefficients (MFCCs)
    - Spectral analysis
    - Deep learning models (CNN, RNN, Transformer)
    - Feature extraction from respiratory sounds
    """
    try:
        # Validate input
        if not data.audio:
            raise HTTPException(status_code=400, detail="Audio data is empty")
        
        if len(data.audio) < 5:
            raise HTTPException(status_code=400, detail="Insufficient audio data for analysis")
        
        # Convert to numpy array for analysis
        audio_array = np.array(data.audio)
        
        logger.info(f"Processing audio data with {len(audio_array)} samples")
        
        # PROTOTYPE: Simple rule-based model
        # In a real implementation, this would be replaced with a trained ML model
        
        # Calculate audio features
        max_amplitude = np.max(audio_array)
        mean_amplitude = np.mean(audio_array)
        std_amplitude = np.std(audio_array)
        amplitude_range = np.max(audio_array) - np.min(audio_array)
        
        # Calculate spectral features (simplified)
        # In real implementation, would use FFT and proper spectral analysis
        high_freq_energy = np.mean(audio_array[audio_array > mean_amplitude + std_amplitude])
        low_freq_energy = np.mean(audio_array[audio_array < mean_amplitude - std_amplitude])
        
        # Simple risk calculation based on audio characteristics
        # Higher amplitudes and irregular patterns may indicate respiratory issues
        base_risk = min(max_amplitude / 100.0, 1.0)
        
        # Add variation based on other features
        variability_factor = min(std_amplitude / 20.0, 0.3)
        range_factor = min(amplitude_range / 80.0, 0.2)
        
        # Combine factors
        risk_score = base_risk * 0.6 + variability_factor + range_factor
        
        # Add some controlled randomness for demo variety
        random_component = np.random.uniform(-0.05, 0.05)
        risk_score = max(0.0, min(1.0, risk_score + random_component))
        
        # Calculate confidence based on data quality
        confidence = min(1.0, len(audio_array) / 60.0)  # Higher confidence with more data
        
        # Prepare analysis details
        analysis = {
            "max_amplitude": float(max_amplitude),
            "mean_amplitude": float(mean_amplitude),
            "std_amplitude": float(std_amplitude),
            "amplitude_range": float(amplitude_range),
            "sample_count": len(audio_array),
            "high_freq_energy": float(high_freq_energy) if not np.isnan(high_freq_energy) else 0.0,
            "low_freq_energy": float(low_freq_energy) if not np.isnan(low_freq_energy) else 0.0,
            "risk_category": "low" if risk_score < 0.3 else "moderate" if risk_score < 0.7 else "high"
        }
        
        logger.info(f"Prediction completed: risk_score={risk_score:.3f}, confidence={confidence:.3f}")
        
        return PredictionResponse(
            risk_score=float(risk_score),
            confidence=float(confidence),
            analysis=analysis
        )
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/batch-predict")
async def batch_predict(data: List[AudioData]):
    """
    Batch prediction endpoint for multiple audio samples
    """
    try:
        results = []
        for i, audio_data in enumerate(data):
            try:
                result = await predict(audio_data)
                results.append({
                    "index": i,
                    "success": True,
                    "prediction": result
                })
            except Exception as e:
                results.append({
                    "index": i,
                    "success": False,
                    "error": str(e)
                })
        
        return {"results": results}
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

if __name__ == "__main__":
    # Run the FastAPI app with uvicorn
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=5000, 
        reload=True,
        log_level="info"
    )
