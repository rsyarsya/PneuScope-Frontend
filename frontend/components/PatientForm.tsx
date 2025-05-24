"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

interface Patient {
  _id: string
  name: string
  dob: string
  allergies: string
  medicalHistory: string
}

interface PatientFormProps {
  patient: Patient | null
  onSubmit: (values: Omit<Patient, "_id">) => void
  onDelete?: () => void
}

// Validation schema
const PatientSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  dob: Yup.date().required("Date of birth is required").max(new Date(), "Date of birth cannot be in the future"),
  allergies: Yup.string(),
  medicalHistory: Yup.string(),
})

function PatientForm({ patient, onSubmit, onDelete }: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues = {
    name: patient?.name || "",
    dob: patient?.dob ? new Date(patient.dob).toISOString().split("T")[0] : "",
    allergies: patient?.allergies || "",
    medicalHistory: patient?.medicalHistory || "",
  }

  const handleSubmit = async (values: Omit<Patient, "_id">) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={PatientSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isValid, dirty }) => (
        <Form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter patient's full name"
              />
              <ErrorMessage name="name" component="div" className="mt-1 text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="dob" className="block text-gray-700 font-medium mb-2">
                Date of Birth
              </label>
              <Field
                type="date"
                name="dob"
                id="dob"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <ErrorMessage name="dob" component="div" className="mt-1 text-red-500 text-sm" />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="allergies" className="block text-gray-700 font-medium mb-2">
              Allergies
            </label>
            <Field
              type="text"
              name="allergies"
              id="allergies"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter allergies (if any)"
            />
            <ErrorMessage name="allergies" component="div" className="mt-1 text-red-500 text-sm" />
          </div>

          <div className="mb-6">
            <label htmlFor="medicalHistory" className="block text-gray-700 font-medium mb-2">
              Medical History
            </label>
            <Field
              as="textarea"
              name="medicalHistory"
              id="medicalHistory"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter relevant medical history"
            />
            <ErrorMessage name="medicalHistory" component="div" className="mt-1 text-red-500 text-sm" />
          </div>

          <div className="flex flex-wrap justify-between gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className={`px-6 py-2 rounded-md ${
                isValid && dirty
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Saving..." : patient ? "Update Patient" : "Add Patient"}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Patient
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default PatientForm
