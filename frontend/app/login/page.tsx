"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})

// Mock login function to simulate login without backend
const mockLogin = async (values: { email: string; password: string }) => {
  // Simulate a delay to mimic API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data
  const mockUser = {
    id: "mock-id",
    email: values.email,
    role: values.email.includes("parent") ? "parent" : "doctor", // Role check based on email
  }

  return {
    data: {
      success: true,
      user: mockUser,
    },
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await mockLogin(values)

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user))
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Login to PneuScope</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form>
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

                  <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-red-500 text-sm" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Demo Credentials:</p>
              <p>Doctor: doctor@pneuscope.com / password123</p>
              <p>Parent: parent@pneuscope.com / password123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}