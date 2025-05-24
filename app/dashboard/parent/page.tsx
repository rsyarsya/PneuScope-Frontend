"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import DashboardLayout from "@/app/components/DashboardLayout"
import PatientList from "@/app/components/PatientList"

interface Child {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
}

export default function ParentDashboard() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
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

    // Fetch children
    fetchChildren()
  }, [router])

  const fetchChildren = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/patients/parent", { withCredentials: true })
      setChildren(response.data)
      setError("")
    } catch (err: any) {
      console.error("Failed to fetch children:", err)
      setError("Failed to load your children's data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChildClick = (childId: string) => {
    router.push(`/dashboard/parent/child/${childId}`)
  }

  return (
    <DashboardLayout title="Parent Dashboard" role="parent">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Your Children</h2>

          {isLoading ? (
            <p className="text-gray-500 text-center py-4">Loading children data...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : children.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No children found. Please contact your doctor to add your child to your account.
              </p>
            </div>
          ) : (
            <PatientList
              patients={children}
              onPatientClick={handleChildClick}
              emptyMessage="No children found. Please contact your doctor."
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Information for Parents</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Welcome to the PneuScope parent portal. Here you can view your child's health records and bronchopneumonia
              risk assessments performed by your doctor.
            </p>
            <p>
              Regular check-ups and early detection are crucial for managing respiratory health in toddlers. If you
              notice any concerning symptoms, please contact your healthcare provider immediately.
            </p>
            <p>Common symptoms of bronchopneumonia include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Persistent cough</li>
              <li>Rapid or difficult breathing</li>
              <li>Fever</li>
              <li>Wheezing or chest pain</li>
              <li>Decreased appetite</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
