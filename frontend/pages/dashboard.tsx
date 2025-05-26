"use client"

import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useState, useEffect } from "react"
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

// Mock patient data
const mockPatients: Patient[] = [
  { _id: "1", name: "John Doe", dob: "2018-05-15", allergies: "None", medicalHistory: "Healthy" },
  { _id: "2", name: "Jane Smith", dob: "2019-07-22", allergies: "Peanuts", medicalHistory: "Asthma" },
];

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [audioData, setAudioData] = useState<number[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set mock patients on component mount
  useEffect(() => {
    setPatients(mockPatients)
    setIsLoading(false)
  }, [])

  // Simulate audio data capture
  useEffect(() => {
    if (isCapturing) {
      const interval = setInterval(() => {
        const randomData = Array(5).fill(0).map(() => Math.floor(Math.random() * 50) + 30)
        setAudioData((prevData) => [...prevData, ...randomData].slice(-60))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isCapturing])

  // Start audio capture
  const startCapture = () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    setIsCapturing(true)
    setAudioData([])
    setRiskScore(null)
  }

  // Stop audio capture and simulate risk score
  const stopCapture = () => {
    setIsCapturing(false)
    if (audioData.length > 0) {
      const mockRiskScore = Math.floor(Math.random() * 100)
      setRiskScore(mockRiskScore)
    }
  }

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setAudioData([])
    setRiskScore(null)
    setIsCapturing(false)
  }

  // Handle patient form submission (create/update)
  const handlePatientSubmit = async (patientData: Omit<Patient, "_id">) => {
    try {
      if (selectedPatient) {
        const updatedPatient = { ...selectedPatient, ...patientData }
        setPatients((prevPatients) => prevPatients.map((p) => (p._id === selectedPatient._id ? updatedPatient : p)))
        setSelectedPatient(updatedPatient)
      } else {
        const newPatient = { _id: Date.now().toString(), ...patientData }
        setPatients((prevPatients) => [...prevPatients, newPatient])
        setSelectedPatient(newPatient)
      }
    } catch (err) {
      console.error("Failed to save patient:", err)
      alert("Failed to save patient data")
    }
  }

  // Handle patient deletion
  const handleDeletePatient = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) {
      return
    }

    try {
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

// Simulate server-side props with mock user
export const getServerSideProps: GetServerSideProps = async (context) => {
  const mockUser: User = {
    _id: "mock-id",
    name: "Mock User",
    email: "mock@example.com",
    role: "doctor",
  };

  return {
    props: {
      user: mockUser,
    },
  };
}

export default Dashboard