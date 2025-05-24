import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        role: string
      }
    }
  }
}

// Protect routes - verify JWT token
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token

    // Get token from Authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
      return
    }

    try {
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

      // Add user to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      }

      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Authorize by role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
      return
    }
    next()
  }
}
