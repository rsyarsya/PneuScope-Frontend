"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.string().oneOf(["doctor", "parent"], "Role must be either Doctor or Parent").required("Role is required"),
})

// Mock registration function to simulate registration without backend
const mockRegister = async (values: {
  name: string
  email: string
  password: string
  role: string
}) => {
  // Simulate a delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate storing the user data in localStorage
  const mockUser = {
    id: Date.now().toString(), // Simple ID generation
    name: values.name,
    email: values.email,
    role: values.role,
  }

  // Simulate saving user data (in a real app, this would be sent to backend)
  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  localStorage.setItem("registeredUsers", JSON.stringify([...existingUsers, mockUser]))

  return {
    data: {
      success: true,
    },
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      // Remove confirmPassword before processing
      const { confirmPassword, ...userData } = values

      const response = await mockRegister(userData)

      if (response.data.success) {
        router.push("/login?registered=true")
      }
    } catch (err: any) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Register for PneuScope</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "doctor",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Create a password"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                      Role
                    </label>
                    <Field
                      as="select"
                      name="role"
                      id="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="parent">Parent</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50"
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </div>
  )
}