"use client"

import type React from "react"

import { useState } from "react"

interface PatientFormProps {
  patient?: {
    name: string
    dob: string
    allergies: string
    medicalHistory: string
    parentEmail?: string
  } | null
  onSubmit: (patientData: any) => void
  onCancel?: () => void
}

export default function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    dob: patient?.dob ? new Date(patient.dob).toISOString().split("T")[0] : "",
    allergies: patient?.allergies || "",
    medicalHistory: patient?.medicalHistory || "",
    parentEmail: patient?.parentEmail || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
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
            placeholder="Enter patient's full name"
          />
        </div>

        <div>
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
      </div>

      <div className="mb-4">
        <label htmlFor="parentEmail" className="block text-gray-700 font-medium mb-2">
          Parent's Email (optional)
        </label>
        <input
          type="email"
          id="parentEmail"
          name="parentEmail"
          value={formData.parentEmail}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter parent's email to grant access"
        />
        <p className="text-sm text-gray-500 mt-1">
          If provided, the parent will be able to view this patient's records
        </p>
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

      <div className="mb-6">
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
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          {patient ? "Update Patient" : "Add Patient"}
        </button>
      </div>
    </form>
  )
}
