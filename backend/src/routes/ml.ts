import express from "express"
import { body } from "express-validator"
import { predictRiskScore, getAudioRecords } from "../controllers/mlController"
import { protect } from "../middleware/auth"
import { validateRequest } from "../middleware/validate"

const router = express.Router()

// Apply auth middleware to all routes
router.use(protect)

/**
 * @swagger
 * /api/predict:
 *   post:
 *     summary: Predict risk score from audio data
 *     tags: [ML]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - audio
 *             properties:
 *               patientId:
 *                 type: string
 *               audio:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Risk score prediction
 *       400:
 *         description: Invalid input
 */
router.post(
  "/predict",
  [
    body("patientId").isMongoId().withMessage("Please provide a valid patient ID"),
    body("audio").isArray().withMessage("Audio data must be an array"),
    validateRequest,
  ],
  predictRiskScore,
)

/**
 * @swagger
 * /api/assessments/patient/{patientId}:
 *   get:
 *     summary: Get audio records for a patient
 *     tags: [ML]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of audio records
 *       404:
 *         description: Patient not found
 */
router.get("/assessments/patient/:patientId", getAudioRecords)

export default router
