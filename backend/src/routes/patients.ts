import express from "express"
import { body, validationResult } from "express-validator"
import Patient from "../models/Patient"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    console.error("Get patients error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single patient
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    })

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json(patient)
  } catch (error) {
    console.error("Get patient error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create patient
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }),
    body("dateOfBirth").isISO8601(),
    body("allergies").optional().trim(),
    body("medicalHistory").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const patient = new Patient({
        ...req.body,
        createdBy: req.user.id,
      })

      await patient.save()
      res.status(201).json(patient)
    } catch (error) {
      console.error("Create patient error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update patient
router.put(
  "/:id",
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("dateOfBirth").optional().isISO8601(),
    body("allergies").optional().trim(),
    body("medicalHistory").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const patient = await Patient.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, {
        new: true,
      })

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" })
      }

      res.json(patient)
    } catch (error) {
      console.error("Update patient error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete patient
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    })

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json({ message: "Patient deleted successfully" })
  } catch (error) {
    console.error("Delete patient error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
