"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import * as yup from "yup"

const registrationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm password"),
  hospitalAffiliation: yup
    .string()
    .min(2, "Hospital name must be at least 2 characters")
    .max(200, "Hospital name too long")
    .required("Hospital affiliation is required"),
  licenseNumber: yup.string().max(50, "License number too long").optional(),
  specialization: yup.string().max(100, "Specialization too long").optional(),
  phoneNumber: yup
    .string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional(),
})

// Common hospital affiliations for autocomplete
const commonHospitals = [
  "Children's Hospital of Philadelphia",
  "Boston Children's Hospital",
  "Cincinnati Children's Hospital Medical Center",
  "Texas Children's Hospital",
  "Children's Hospital Los Angeles",
  "Children's National Hospital",
  "Children's Hospital Colorado",
  "Seattle Children's Hospital",
  "Children's Healthcare of Atlanta",
  "St. Jude Children's Research Hospital",
]

// Common pediatric specializations
const commonSpecializations = [
  "Pediatric Pulmonology",
  "Pediatric Emergency Medicine",
  "General Pediatrics",
  "Pediatric Critical Care",
  "Pediatric Cardiology",
  "Neonatology",
  "Pediatric Infectious Disease",
  "Pediatric Respiratory Medicine",
]

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    hospitalAffiliation: "",
    licenseNumber: "",
    specialization: "",
    phoneNumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [showHospitalSuggestions, setShowHospitalSuggestions] = useState(false)
  const [showSpecializationSuggestions, setShowSpecializationSuggestions] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await registrationSchema.validate(formData, { abortEarly: false })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          hospitalAffiliation: formData.hospitalAffiliation,
          licenseNumber: formData.licenseNumber || undefined,
          specialization: formData.specialization || undefined,
          phoneNumber: formData.phoneNumber || undefined,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 3000)
      } else {
        const data = await response.json()
        if (data.errors) {
          const validationErrors: Record<string, string> = {}
          data.errors.forEach((error: any) => {
            validationErrors[error.path || error.param] = error.msg || error.message
          })
          setErrors(validationErrors)
        } else {
          setErrors({ general: data.message || "Registration failed" })
        }
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      } else {
        setErrors({ general: "Network error occurred" })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleHospitalSelect = (hospital: string) => {
    setFormData((prev) => ({ ...prev, hospitalAffiliation: hospital }))
    setShowHospitalSuggestions(false)
  }

  const handleSpecializationSelect = (specialization: string) => {
    setFormData((prev) => ({ ...prev, specialization }))
    setShowSpecializationSuggestions(false)
  }

  const filteredHospitals = commonHospitals.filter((hospital) =>
    hospital.toLowerCase().includes(formData.hospitalAffiliation.toLowerCase()),
  )

  const filteredSpecializations = commonSpecializations.filter((spec) =>
    spec.toLowerCase().includes(formData.specialization.toLowerCase()),
  )

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Registration Successful!</h2>
          <p>Your doctor account has been created successfully.</p>
          <p className="text-sm mt-2">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Doctor Registration - PneuScope</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register as a Doctor</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create your medical professional account for PneuScope
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errors.general}</div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Dr. John Smith"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className="input-field"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>

                <div className="relative">
                  <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital Affiliation *
                  </label>
                  <input
                    id="hospitalAffiliation"
                    name="hospitalAffiliation"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Enter hospital name"
                    value={formData.hospitalAffiliation}
                    onChange={handleChange}
                    onFocus={() => setShowHospitalSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowHospitalSuggestions(false), 200)}
                  />
                  {errors.hospitalAffiliation && (
                    <p className="text-red-500 text-xs mt-1">{errors.hospitalAffiliation}</p>
                  )}

                  {/* Hospital Suggestions */}
                  {showHospitalSuggestions && formData.hospitalAffiliation && filteredHospitals.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredHospitals.map((hospital) => (
                        <button
                          key={hospital}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => handleHospitalSelect(hospital)}
                        >
                          {hospital}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    className="input-field"
                    placeholder="License number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                  {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                </div>

                <div className="relative">
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className="input-field"
                    placeholder="Medical specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    onFocus={() => setShowSpecializationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSpecializationSuggestions(false), 200)}
                  />
                  {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}

                  {/* Specialization Suggestions */}
                  {showSpecializationSuggestions && formData.specialization && filteredSpecializations.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredSpecializations.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => handleSpecializationSelect(spec)}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Registration Notes:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• All doctors require hospital affiliation verification</li>
                    <li>• License number helps with credential verification</li>
                    <li>• Specialization helps with patient assignment</li>
                    <li>• Account activation may require admin approval</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Register Doctor Account"}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-medical-600 hover:text-medical-500">
                Already have an account? Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
