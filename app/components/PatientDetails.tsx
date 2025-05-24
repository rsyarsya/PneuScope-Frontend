"use client"

import type React from "react"

import { useState } from "react"

interface Patient {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
  parentId?: string
}

interface PatientDetailsProps {
  patient: Patient
  onUpdate?: (updatedData: Partial<Patient>) => void
  readOnly?: boolean
}

export default function PatientDetails({ patient, onUpdate, readOnly = false }: PatientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: patient.name,
    dob: new Date(patient.dob).toISOString().split("T")[0],
    allergies: patient.allergies,
    medicalHistory: patient.medicalHistory,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onUpdate) {
      onUpdate(formData)
    }
    setIsEditing(false)
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    const ageInMs = today.getTime() - birthDate.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25))
    const ageInMonths = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44))

    if (ageInYears > 0) {
      return `${ageInYears} year${ageInYears > 1 ? "s" : ""}`
    } else {
      return `${ageInMonths} month${ageInMonths > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Patient Details</h2>
        {!readOnly && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="allergies" className="block text-gray-700 font-medium mb-2">
              Allergies
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter allergies (if any)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="medicalHistory" className="block text-gray-700 font-medium mb-2">
              Medical History
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter relevant medical history"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-gray-900">{patient.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1 text-gray-900">{new Date(patient.dob).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Age</h3>
            <p className="mt-1 text-gray-900">{calculateAge(patient.dob)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="mt-1 text-gray-900">{patient.allergies || "None reported"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
              {patient.medicalHistory || "No medical history recorded"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
