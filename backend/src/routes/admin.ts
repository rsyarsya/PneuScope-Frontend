import express from "express"
import { query, param, body, validationResult } from "express-validator"
import User from "../models/User"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Admin middleware
const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin role required." })
  }
  next()
}

// Apply auth middleware to all routes
router.use(authMiddleware)
router.use(adminMiddleware)

// Get all doctors with filtering and pagination
router.get(
  "/doctors",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1-100"),
    query("hospital").optional().trim().withMessage("Invalid hospital filter"),
    query("specialization").optional().trim().withMessage("Invalid specialization filter"),
    query("search").optional().trim().withMessage("Invalid search term"),
    query("status").optional().isIn(["active", "inactive", "all"]).withMessage("Invalid status filter"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const skip = (page - 1) * limit

      // Build filter query
      const filter: any = { role: "doctor" }

      if (req.query.hospital) {
        filter.hospitalAffiliation = { $regex: req.query.hospital, $options: "i" }
      }

      if (req.query.specialization) {
        filter.specialization = { $regex: req.query.specialization, $options: "i" }
      }

      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { hospitalAffiliation: { $regex: req.query.search, $options: "i" } },
        ]
      }

      if (req.query.status && req.query.status !== "all") {
        filter.isActive = req.query.status === "active"
      }

      // Get doctors with pagination
      const doctors = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

      // Get total count for pagination
      const total = await User.countDocuments(filter)

      // Get hospital statistics
      const hospitalStats = await User.aggregate([
        { $match: { role: "doctor", isActive: true } },
        { $group: { _id: "$hospitalAffiliation", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])

      res.json({
        doctors,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
        hospitalStats,
      })
    } catch (error) {
      console.error("Get doctors error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get doctor by ID
router.get("/doctors/:id", [param("id").isMongoId().withMessage("Invalid doctor ID")], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password")

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    res.json(doctor)
  } catch (error) {
    console.error("Get doctor error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update doctor status (activate/deactivate)
router.patch(
  "/doctors/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid doctor ID"),
    body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const doctor = await User.findOneAndUpdate(
        { _id: req.params.id, role: "doctor" },
        { isActive: req.body.isActive },
        { new: true },
      ).select("-password")

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" })
      }

      res.json({
        message: `Doctor ${req.body.isActive ? "activated" : "deactivated"} successfully`,
        doctor,
      })
    } catch (error) {
      console.error("Update doctor status error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get hospital statistics
router.get("/hospitals/stats", async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: "doctor" } },
      {
        $group: {
          _id: "$hospitalAffiliation",
          totalDoctors: { $sum: 1 },
          activeDoctors: { $sum: { $cond: ["$isActive", 1, 0] } },
          specializations: { $addToSet: "$specialization" },
        },
      },
      { $sort: { totalDoctors: -1 } },
    ])

    const totalHospitals = stats.length
    const totalDoctors = await User.countDocuments({ role: "doctor" })
    const activeDoctors = await User.countDocuments({ role: "doctor", isActive: true })

    res.json({
      summary: {
        totalHospitals,
        totalDoctors,
        activeDoctors,
        inactiveDoctors: totalDoctors - activeDoctors,
      },
      hospitals: stats,
    })
  } catch (error) {
    console.error("Hospital stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
