"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import DashboardLayout from "@/app/components/DashboardLayout"
import PatientDetails from "@/app/components/PatientDetails"
import PatientHistory from "@/app/components/PatientHistory"

interface Child {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
}

interface Assessment {
  _id: string
  patientId: string
  audioData: number[]
  riskScore: number
  createdAt: string
}

export default function ChildDetailPage() {
  const params = useParams()
  const router = useRouter()
  const childId = params.id as string

  const [child, setChild] = useState<Child | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is authenticated and is a parent
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/auth")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "parent") {
      router.push("/dashboard/doctor")
      return
    }

    // Fetch child details and assessments
    fetchChildDetails()
    fetchAssessments()
  }, [childId, router])

  const fetchChildDetails = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/patients/${childId}`, { withCredentials: true })
      setChild(response.data)
      setError("")
    } catch (err: any) {
      console.error("Failed to fetch child details:", err)
      setError("Failed to load child details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`/api/assessments/patient/${childId}`, { withCredentials: true })
      setAssessments(response.data)
    } catch (err: any) {
      console.error("Failed to fetch assessments:", err)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Child Details" role="parent">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading child details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !child) {
    return (
      <DashboardLayout title="Child Details" role="parent">
        <div className="text-center py-12">
          <p className="text-red-500">{error || "Child not found"}</p>
          <button
            onClick={() => router.push("/dashboard/parent")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Child: ${child.name}`} role="parent">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - Child details */}
          <div className="md:col-span-1">
            <PatientDetails patient={child} readOnly />
          </div>

          {/* Main content - Assessment history */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Assessment History</h2>

              <PatientHistory assessments={assessments} />

              {assessments.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No assessments found for your child yet. Your doctor will perform assessments during check-ups.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Understanding Risk Scores</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              The risk score is a measure of the likelihood of bronchopneumonia based on audio analysis of your child's
              breathing sounds. Scores are categorized as follows:
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-green-100 rounded-md">
                <div className="font-medium text-green-800">Low Risk (0-30%)</div>
                <p className="text-sm text-green-700 mt-1">
                  Normal breathing patterns with no concerning sounds detected.
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-md">
                <div className="font-medium text-yellow-800">Moderate Risk (31-70%)</div>
                <p className="text-sm text-yellow-700 mt-1">Some abnormal sounds detected. Follow-up recommended.</p>
              </div>
              <div className="p-3 bg-red-100 rounded-md">
                <div className="font-medium text-red-800">High Risk (71-100%)</div>
                <p className="text-sm text-red-700 mt-1">
                  Significant abnormal sounds detected. Immediate medical attention advised.
                </p>
              </div>
            </div>
            <p className="text-sm italic mt-4">
              Note: This is a screening tool and not a definitive diagnosis. Always consult with your healthcare
              provider for proper medical advice.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
