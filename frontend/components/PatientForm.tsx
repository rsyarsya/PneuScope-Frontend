"use client"

import type React from "react"

import { useState } from "react"
import * as yup from "yup"

const patientSchema = yup.object({
  name: yup.string().required("Name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  allergies: yup.string(),
  medicalHistory: yup.string(),
})

interface PatientFormProps {
  onSuccess: () => void
}

export default function PatientForm({ onSuccess }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    allergies: "",
    medicalHistory: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await patientSchema.validate(formData, { abortEarly: false })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", dateOfBirth: "", allergies: "", medicalHistory: "" })
        onSuccess()
      } else {
        throw new Error("Failed to create patient")
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter patient name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="input-field"
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="input-field"
          rows={2}
          placeholder="List any known allergies"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          className="input-field"
          rows={3}
          placeholder="Relevant medical history"
        />
      </div>

      <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
        {loading ? "Adding Patient..." : "Add Patient"}
      </button>
    </form>
  )
}
