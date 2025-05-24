"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import type { GetServerSideProps } from "next"
import { useAuth } from "@/contexts/AuthContext"
import PatientForm from "@/components/PatientForm"
import LiveChart from "@/components/LiveChart"
import RiskGauge from "@/components/RiskGauge"
import PatientList from "@/components/PatientList"
import { Play, Square, Users, Activity } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import SystemStatus from "@/components/SystemStatus"

interface Patient {
  _id: string
  name: string
  dateOfBirth: string
  allergies: string
  medicalHistory: string
  createdAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("monitor")
  const [isCapturing, setIsCapturing] = useState(false)
  const [audioData, setAudioData] = useState<number[]>([])
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    // Initialize socket connection with proper URL
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
    })
    setSocket(newSocket)

    // Listen for audio data
    newSocket.on("audio-data", (data: number[]) => {
      setAudioData((prev) => [...prev.slice(-59), ...data]) // Keep last 60 seconds
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const startCapture = () => {
    if (socket && selectedPatient) {
      setIsCapturing(true)
      setAudioData([])
      setRiskScore(null)
      socket.emit("start-capture", { patientId: selectedPatient._id })
    }
  }

  const stopCapture = async () => {
    if (socket) {
      setIsCapturing(false)
      socket.emit("stop-capture")

      // Send audio data to ML service for analysis
      try {
        const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000"
        const response = await fetch(`${mlApiUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: audioData }),
        })
        const result = await response.json()
        setRiskScore(result.risk_score)
      } catch (error) {
        console.error("ML prediction error:", error)
        // Fallback: simple rule-based risk calculation
        const maxDecibel = Math.max(...audioData)
        setRiskScore(Math.min(maxDecibel / 100, 1))
      }
    }
  }

  const loadPatients = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/patients`, {
        credentials: "include",
      })
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Error loading patients:", error)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  return (
    <>
      <Head>
        <title>Dashboard - PneuScope</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Dr. {user?.name || "User"}</h1>
          <p className="text-gray-600">Monitor patients and analyze chest audio data</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("monitor")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "monitor"
                  ? "border-medical-500 text-medical-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Monitor
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "patients"
                  ? "border-medical-500 text-medical-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Patients
            </button>
          </nav>
        </div>

        {/* Monitor Tab */}
        {activeTab === "monitor" && (
          <div className="space-y-8">
            {/* Patient Selection */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Select Patient</h2>
              <select
                className="input-field"
                value={selectedPatient?._id || ""}
                onChange={(e) => {
                  const patient = patients.find((p) => p._id === e.target.value)
                  setSelectedPatient(patient || null)
                }}
              >
                <option value="">Choose a patient...</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} - {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Audio Capture Controls */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Audio Capture</h2>
                <div className="space-x-4">
                  <button
                    onClick={startCapture}
                    disabled={!selectedPatient || isCapturing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Start Capture
                  </button>
                  <button
                    onClick={stopCapture}
                    disabled={!isCapturing}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Square className="w-4 h-4 inline mr-2" />
                    Stop Capture
                  </button>
                </div>
              </div>

              {isCapturing && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  🔴 Recording chest audio... ({audioData.length} data points collected)
                </div>
              )}
            </div>

            {/* Live Chart and Risk Gauge */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Live Audio Data (dB)</h3>
                <LiveChart data={audioData} />
              </div>

              {riskScore !== null && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
                  <RiskGauge score={riskScore} />
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Risk Score:</strong> {(riskScore * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {riskScore < 0.3
                        ? "✅ Low risk detected"
                        : riskScore < 0.7
                          ? "⚠️ Moderate risk - monitor closely"
                          : "🚨 High risk - immediate attention recommended"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* System Status */}
            {activeTab === "monitor" && (
              <div className="mt-8">
                <SystemStatus />
              </div>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
              <PatientForm onSuccess={loadPatients} />
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Patient List</h2>
              <PatientList patients={patients} onUpdate={loadPatients} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Simple auth check - in production, verify JWT token
  const { req } = context
  const token = req.cookies.token

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
