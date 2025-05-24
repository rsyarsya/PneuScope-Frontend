"use client"

import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useState, useEffect } from "react"
import axios from "axios"
import { io, type Socket } from "socket.io-client"
import Navbar from "../components/Navbar"
import PatientForm from "../components/PatientForm"
import LiveChart from "../components/LiveChart"
import RiskGauge from "../components/RiskGauge"

// Types
interface Patient {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
}

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "doctor"
}

interface DashboardProps {
  user: User
}

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [audioData, setAudioData] = useState<number[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients")
        setPatients(response.data)
      } catch (err) {
        setError("Failed to fetch patients")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Socket.io connection
  useEffect(() => {
    if (isCapturing && !socket) {
      // Connect to socket server
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")

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
    } else if (!isCapturing && socket) {
      // Disconnect socket when not capturing
      socket.disconnect()
      setSocket(null)
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [isCapturing, socket])

  // Function to start audio capture
  const startCapture = () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    setIsCapturing(true)
    setAudioData([])
    setRiskScore(null)
  }

  // Function to stop audio capture and send data for analysis
  const stopCapture = async () => {
    setIsCapturing(false)

    if (audioData.length === 0) {
      alert("No audio data captured")
      return
    }

    try {
      // Send audio data to ML service for analysis
      const response = await axios.post("/api/predict", {
        patientId: selectedPatient?._id,
        audio: audioData,
      })

      setRiskScore(response.data.risk_score)
    } catch (err) {
      console.error("Failed to analyze audio data:", err)
      alert("Failed to analyze audio data")
    }
  }

  // Function to handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    // Reset data when changing patients
    setAudioData([])
    setRiskScore(null)
    setIsCapturing(false)
  }

  // Function to handle patient form submission (create/update)
  const handlePatientSubmit = async (patientData: Omit<Patient, "_id">) => {
    try {
      if (selectedPatient) {
        // Update existing patient
        const response = await axios.put(`/api/patients/${selectedPatient._id}`, patientData)
        setPatients((prevPatients) => prevPatients.map((p) => (p._id === selectedPatient._id ? response.data : p)))
        setSelectedPatient(response.data)
      } else {
        // Create new patient
        const response = await axios.post("/api/patients", patientData)
        setPatients((prevPatients) => [...prevPatients, response.data])
        setSelectedPatient(response.data)
      }
    } catch (err) {
      console.error("Failed to save patient:", err)
      alert("Failed to save patient data")
    }
  }

  // Function to delete a patient
  const handleDeletePatient = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) {
      return
    }

    try {
      await axios.delete(`/api/patients/${patientId}`)
      setPatients((prevPatients) => prevPatients.filter((p) => p._id !== patientId))
      if (selectedPatient?._id === patientId) {
        setSelectedPatient(null)
        setAudioData([])
        setRiskScore(null)
        setIsCapturing(false)
      }
    } catch (err) {
      console.error("Failed to delete patient:", err)
      alert("Failed to delete patient")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - PneuScope</title>
        <meta name="description" content="PneuScope dashboard for patient monitoring" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Patient list */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Patients</h2>

            {isLoading ? (
              <p>Loading patients...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition"
                  >
                    Add New Patient
                  </button>
                </div>

                {patients.length === 0 ? (
                  <p>No patients found. Add your first patient.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <li key={patient._id} className="py-2">
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className={`w-full text-left px-3 py-2 rounded-md ${
                            selectedPatient?._id === patient._id
                              ? "bg-primary-100 text-primary-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">DOB: {new Date(patient.dob).toLocaleDateString()}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Main content - Patient form and audio capture */}
          <div className="lg:col-span-2">
            {/* Patient form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">
                {selectedPatient ? "Edit Patient" : "Add New Patient"}
              </h2>

              <PatientForm
                patient={selectedPatient}
                onSubmit={handlePatientSubmit}
                onDelete={selectedPatient ? () => handleDeletePatient(selectedPatient._id) : undefined}
              />
            </div>

            {/* Audio capture and analysis */}
            {selectedPatient && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Audio Capture & Analysis</h2>

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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Get the token from cookies
    const { req } = context

    // Call the API to verify the token and get user data
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        Cookie: req.headers.cookie || "",
      },
    })

    // If the user is authenticated, return the user data
    return {
      props: {
        user: response.data.user,
      },
    }
  } catch (error) {
    // If the user is not authenticated, redirect to login
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
}

export default Dashboard
