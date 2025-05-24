import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"

import authRoutes from "./routes/auth"
import patientRoutes from "./routes/patients"
import adminRoutes from "./routes/admin"
import { setupSocketHandlers } from "./socket/handlers"
import { seedDatabase } from "./utils/seedData"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
})

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/patients", patientRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Socket.io setup
setupSocketHandlers(io)

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pneuscope")
  .then(async () => {
    console.log("✅ Connected to MongoDB")
    await seedDatabase()
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err))

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 PneuScope Backend running on port ${PORT}`)
  console.log(`📊 Socket.io server ready for real-time connections`)
})
