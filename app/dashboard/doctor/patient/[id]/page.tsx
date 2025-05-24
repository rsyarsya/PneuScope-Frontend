"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { io, type Socket } from "socket.io-client"
import DashboardLayout from "@/app/components/DashboardLayout"
import PatientDetails from "@/app/components/PatientDetails"
import LiveChart from "@/app/components/LiveChart"
import RiskGauge from "@/app/components/RiskGauge"
import PatientHistory from "@/app/components/PatientHistory"

interface Patient {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
  parentId?: string
}

interface Assessment {
  _id: string
  patientId: string
  audioData: number[]
  riskScore: number
  createdAt: string
}

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [audioData, setAudioData] = useState<number[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"live" | "history">("live")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is authenticated and is a doctor
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "doctor") {
      router.push("/dashboard/parent")
      return
    }

    // Fetch patient details
    fetchPatientDetails()
    fetchAssessments()

    return () => {
      // Clean up socket connection
      if (socket) {
        socket.disconnect()
      }
    }
  }, [patientId, router])

  const fetchPatientDetails = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/patients/${patientId}`, { withCredentials: true })
      setPatient(response.data)
      setError("")
    } catch (err: any) {
      console.error("Failed to fetch patient details:", err)
      setError("Failed to load patient details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`/api/assessments/patient/${patientId}`, { withCredentials: true })
      setAssessments(response.data)
    } catch (err: any) {
      console.error("Failed to fetch assessments:", err)
    }
  }

  const startCapture = () => {
    setIsCapturing(true)
    setAudioData([])
    setRiskScore(null)

    // Connect to socket server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    const newSocket = io(socketUrl)

    newSocket.on("connect", () => {
      console.log("Connected to socket server")
    })

    newSocket.on("audio-data", (data: number[]) => {
      setAudioData((prevData) => {
        // Keep only the last 60 seconds of data (assuming 1 data point per second)
        const newData = [...prevData, ...data]
        return newData.slice(-60)
      })
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    setSocket(newSocket)
  }

  const stopCapture = async () => {
    setIsCapturing(false)

    // Disconnect socket
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }

    if (audioData.length === 0) {
      alert("No audio data captured")
      return
    }

    try {
      // Send audio data to ML service for analysis
      const response = await axios.post(
        "/api/predict",
        {
          patientId,
          audio: audioData,
        },
        { withCredentials: true },
      )

      setRiskScore(response.data.risk_score)

      // Refresh assessments list
      fetchAssessments()
    } catch (err: any) {
      console.error("Failed to analyze audio data:", err)
      alert("Failed to analyze audio data")
    }
  }

  const updatePatient = async (updatedData: Partial<Patient>) => {
    try {
      const response = await axios.put(`/api/patients/${patientId}`, updatedData, { withCredentials: true })
      setPatient(response.data)
    } catch (err: any) {
      console.error("Failed to update patient:", err)
      alert("Failed to update patient details")
    }
  }

  // Simulate audio data if socket is not available (for demo purposes)
  useEffect(() => {
    if (isCapturing && !socket) {
      const interval = setInterval(() => {
        // Generate random audio data between 30-80 dB
        const randomData = Array(5)
          .fill(0)
          .map(() => Math.floor(Math.random() * 50) + 30)

        setAudioData((prevData) => {
          const newData = [...prevData, ...randomData]
          return newData.slice(-60)
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isCapturing, socket])

  if (isLoading) {
    return (
      <DashboardLayout title="Patient Details" role="doctor">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading patient details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !patient) {
    return (
      <DashboardLayout title="Patient Details" role="doctor">
        <div className="text-center py-12">
          <p className="text-red-500">{error || "Patient not found"}</p>
          <button
            onClick={() => router.push("/dashboard/doctor")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Patient: ${patient.name}`} role="doctor">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Patient details */}
        <div className="lg:col-span-1">
          <PatientDetails patient={patient} onUpdate={updatePatient} />
        </div>

        {/* Main content - Audio capture and history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 font-medium ${
                  activeTab === "live"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("live")}
              >
                Live Capture
              </button>
              <button
                className={`flex-1 py-3 font-medium ${
                  activeTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("history")}
              >
                Assessment History
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "live" ? (
                <div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      onClick={startCapture}
                      disabled={isCapturing}
                      className={`px-4 py-2 rounded-md ${
                        isCapturing ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      Start Capture
                    </button>

                    <button
                      onClick={stopCapture}
                      disabled={!isCapturing}
                      className={`px-4 py-2 rounded-md ${
                        !isCapturing ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Stop Capture
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-medium mb-2">Live Audio Data</h3>
                      <LiveChart data={audioData} />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Risk Assessment</h3>
                      <RiskGauge score={riskScore} />
                    </div>
                  </div>
                </div>
              ) : (
                <PatientHistory assessments={assessments} />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
