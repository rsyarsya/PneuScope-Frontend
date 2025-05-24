import type { Request, Response } from "express"
import Patient from "../models/Patient"

// Get all patients
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 })

    res.status(200).json(patients)
  } catch (error) {
    console.error("Get all patients error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get patients",
    })
  }
}

// Get patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id)

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      })
      return
    }

    res.status(200).json(patient)
  } catch (error) {
    console.error("Get patient by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get patient",
    })
  }
}

// Create a new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, dob, allergies, medicalHistory } = req.body

    const patient = await Patient.create({
      name,
      dob,
      allergies,
      medicalHistory,
      createdBy: req.user.id,
    })

    res.status(201).json(patient)
  } catch (error) {
    console.error("Create patient error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create patient",
    })
  }
}

// Update a patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, dob, allergies, medicalHistory } = req.body

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name,
        dob,
        allergies,
        medicalHistory,
      },
      { new: true, runValidators: true },
    )

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      })
      return
    }

    res.status(200).json(patient)
  } catch (error) {
    console.error("Update patient error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update patient",
    })
  }
}

// Delete a patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    })
  } catch (error) {
    console.error("Delete patient error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete patient",
    })
  }
}
