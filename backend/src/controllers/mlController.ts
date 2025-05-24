import type { Request, Response } from "express"
import axios from "axios"
import AudioRecord from "../models/AudioRecord"

// Predict risk score from audio data
export const predictRiskScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, audio } = req.body

    if (!patientId || !audio || !Array.isArray(audio)) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
      })
      return
    }

    // Call ML service for prediction
    let riskScore: number

    try {
      // Try to get prediction from ML service
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL || "http://localhost:5000"}/predict`, { audio })
      riskScore = mlResponse.data.risk_score
    } catch (error) {
      console.error("ML service error:", error)

      // Fallback to simple rule-based model if ML service is unavailable
      // For prototype: risk = max(audio)/100
      riskScore = Math.min(Math.max(...audio) / 100, 1)
      console.log("Using fallback risk calculation:", riskScore)
    }

    // Save audio record to database
    await AudioRecord.create({
      patientId,
      audioData: audio,
      riskScore,
      createdBy: req.user.id,
    })

    res.status(200).json({
      success: true,
      risk_score: riskScore,
    })
  } catch (error) {
    console.error("Predict risk score error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to predict risk score",
    })
  }
}

// Get audio records for a patient
export const getAudioRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params

    const audioRecords = await AudioRecord.find({ patientId }).sort({ createdAt: -1 })

    res.status(200).json(audioRecords)
  } catch (error) {
    console.error("Get audio records error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get audio records",
    })
  }
}
