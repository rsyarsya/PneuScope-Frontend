"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"

interface Patient {
  _id: string
  name: string
  dateOfBirth: string
  allergies: string
  medicalHistory: string
  createdAt: string
}

interface PatientListProps {
  patients: Patient[]
  onUpdate: () => void
}

export default function PatientList({ patients, onUpdate }: PatientListProps) {
  const deletePatient = async (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
        onUpdate()
      } catch (error) {
        console.error("Error deleting patient:", error)
      }
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())

    if (months < 12) {
      return `${months} months`
    } else {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`
    }
  }

  return (
    <div className="space-y-4">
      {patients.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No patients registered yet</p>
      ) : (
        patients.map((patient) => (
          <div key={patient._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p className="text-sm text-gray-600">
                  Age: {calculateAge(patient.dateOfBirth)} • DOB:{" "}
                  {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}
                </p>
                {patient.allergies && (
                  <p className="text-sm text-red-600 mt-1">
                    <strong>Allergies:</strong> {patient.allergies}
                  </p>
                )}
                {patient.medicalHistory && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>History:</strong> {patient.medicalHistory}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Added: {format(new Date(patient.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => deletePatient(patient._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete patient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
