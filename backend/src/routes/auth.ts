import express from "express"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import User from "../models/User"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user and include hospital affiliation
      const user = await User.findOne({ email, isActive: true })
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Generate JWT with additional user info
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          hospitalAffiliation: user.hospitalAffiliation,
          specialization: user.specialization,
        },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" },
      )

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          hospitalAffiliation: user.hospitalAffiliation,
          specialization: user.specialization,
          licenseNumber: user.licenseNumber,
          phoneNumber: user.phoneNumber,
        },
        token, // Also send in response for frontend storage
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Register (for doctors)
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("hospitalAffiliation")
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Hospital affiliation must be between 2-200 characters"),
    body("licenseNumber").optional().trim().isLength({ max: 50 }).withMessage("License number too long"),
    body("specialization").optional().trim().isLength({ max: 100 }).withMessage("Specialization too long"),
    body("phoneNumber")
      .optional()
      .matches(/^[+]?[1-9][\d]{0,15}$/)
      .withMessage("Please provide a valid phone number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, hospitalAffiliation, licenseNumber, specialization, phoneNumber } = req.body

      // Check if user exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Check if license number exists (if provided)
      if (licenseNumber) {
        const existingLicense = await User.findOne({ licenseNumber })
        if (existingLicense) {
          return res.status(400).json({ message: "License number already registered" })
        }
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        hospitalAffiliation,
        licenseNumber,
        specialization,
        phoneNumber,
        role: "doctor", // Default role for registration
      })

      await user.save()

      res.status(201).json({
        message: "Doctor registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hospitalAffiliation: user.hospitalAffiliation,
          specialization: user.specialization,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  authMiddleware,
  [
    body("name").optional().trim().isLength({ min: 2, max: 100 }),
    body("hospitalAffiliation").optional().trim().isLength({ min: 2, max: 200 }),
    body("specialization").optional().trim().isLength({ max: 100 }),
    body("phoneNumber")
      .optional()
      .matches(/^[+]?[1-9][\d]{0,15}$/),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, hospitalAffiliation, specialization, phoneNumber } = req.body

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...(name && { name }),
          ...(hospitalAffiliation && { hospitalAffiliation }),
          ...(specialization && { specialization }),
          ...(phoneNumber && { phoneNumber }),
        },
        { new: true, runValidators: true },
      ).select("-password")

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json(user)
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out successfully" })
})

export default router
