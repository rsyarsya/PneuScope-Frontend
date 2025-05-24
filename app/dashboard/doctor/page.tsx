"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import PatientList from "@/app/components/PatientList"
import PatientForm from "@/app/components/PatientForm"
import DashboardLayout from "@/app/components/DashboardLayout"

interface Patient {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
  parentId?: string
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isAddingPatient, setIsAddingPatient] = useState(false)
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

    // Fetch patients
    fetchPatients()
  }, [router])

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/patients", { withCredentials: true })
      setPatients(response.data)
      setError("")
    } catch (err: any) {
      console.error("Failed to fetch patients:", err)
      setError("Failed to load patients. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPatient = async (patientData: Omit<Patient, "_id">) => {
    try {
      const response = await axios.post("/api/patients", patientData, { withCredentials: true })
      setPatients((prev) => [...prev, response.data])
      setIsAddingPatient(false)
    } catch (err: any) {
      console.error("Failed to add patient:", err)
      setError("Failed to add patient. Please try again.")
    }
  }

  const handlePatientClick = (patientId: string) => {
    router.push(`/dashboard/doctor/patient/${patientId}`)
  }

  return (
    <DashboardLayout title="Doctor Dashboard" role="doctor">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Patient list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-700">Your Patients</h2>
              <button
                onClick={() => setIsAddingPatient(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
              >
                Add Patient
              </button>
            </div>

            {isLoading ? (
              <p className="text-gray-500 text-center py-4">Loading patients...</p>
            ) : error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : (
              <PatientList
                patients={patients}
                onPatientClick={handlePatientClick}
                emptyMessage="No patients found. Add your first patient."
              />
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          {isAddingPatient ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Add New Patient</h2>
              <PatientForm onSubmit={handleAddPatient} onCancel={() => setIsAddingPatient(false)} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Welcome to Your Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Select a patient from the list to view their details or add a new patient.
              </p>
              <p className="text-gray-500 text-sm">
                You can monitor patient health, capture audio data, and view risk assessments.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
