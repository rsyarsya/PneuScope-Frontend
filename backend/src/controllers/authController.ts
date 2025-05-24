import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User, { type IUser } from "../models/User"

// Generate JWT token
const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "your_jwt_secret_key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Set JWT cookie
const sendTokenCookie = (res: Response, token: string): void => {
  const cookieOptions = {
    expires: new Date(Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  res.cookie("token", token, cookieOptions)
}

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
      return
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "doctor", // Default to doctor role
    })

    // Remove password from response
    user.password = ""

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    })
  }
}

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
      return
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
      return
    }

    // Generate token
    const token = generateToken(user)

    // Set token cookie
    sendTokenCookie(res, token)

    // Remove password from response
    user.password = ""

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to login",
    })
  }
}

// Logout user
export const logout = (req: Request, res: Response): void => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  })
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    })
  }
}

// Verify token
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
      return
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key") as {
      id: string
      role: string
    }

    // Check if user exists
    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      user,
    })
  } catch (error) {
    console.error("Verify token error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}
