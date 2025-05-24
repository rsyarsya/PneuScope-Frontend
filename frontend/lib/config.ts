interface Config {
  apiUrl: string
  mlApiUrl: string
  socketUrl: string
  isDevelopment: boolean
  isProduction: boolean
}

const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  mlApiUrl: process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000",
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
}

// Validate required environment variables in production
if (config.isProduction) {
  const requiredEnvVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_ML_API_URL"]

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
  }
}

export default config
