import express from "express"
import http from "http"
import { Server as SocketIOServer } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from "./routes/auth"
import patientRoutes from "./routes/patients"
import mlRoutes from "./routes/ml"

// Import socket handler
import setupSocketIO from "./socket"

// Import seed data function
import { seedDatabase } from "./utils/seedData"

// Create Express app
const app = express()
const server = http.createServer(app)

// Set up Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Set up middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)

// Set up Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PneuScope API",
      version: "1.0.0",
      description: "API documentation for PneuScope application",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Set up routes
app.use("/api/auth", authRoutes)
app.use("/api/patients", patientRoutes)
app.use("/api", mlRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Set up Socket.IO handler
setupSocketIO(io)

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pneuscope"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")

    // Seed database with initial data if needed
    if (process.env.NODE_ENV === "development") {
      seedDatabase()
    }

    // Start server
    const PORT = process.env.PORT || 4000
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  server.close(() => process.exit(1))
})
