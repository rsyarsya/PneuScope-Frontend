import type { NextPage } from "next"
import Head from "next/head"
import Navbar from "../components/Navbar"

const Docs: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Documentation - PneuScope</title>
        <meta name="description" content="PneuScope documentation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-700 mb-6">PneuScope Documentation</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">Overview</h2>
            <p className="mb-4">
              PneuScope is an IoT solution designed for early detection of bronchopneumonia in toddlers. The system
              captures chest audio, processes it, and uses machine learning to assess the risk of bronchopneumonia.
            </p>
            <p>
              This prototype demonstrates the end-to-end functionality of the system, from patient registration to audio
              capture and risk assessment.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">User Roles</h2>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Admin</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manage users (view, create, update, delete)</li>
                <li>Access system logs</li>
                <li>All doctor capabilities</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Doctor</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Register and manage patients</li>
                <li>Start and stop audio capture</li>
                <li>View risk assessment results</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-primary-600 mb-2">Guest</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>View landing page</li>
                <li>Access documentation</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">Technical Architecture</h2>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Frontend</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Next.js (React) with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>Socket.io-client for real-time data</li>
                <li>Recharts for data visualization</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Backend</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Node.js + Express.js (TypeScript)</li>
                <li>Socket.io for real-time communication</li>
                <li>MongoDB Atlas for data storage</li>
                <li>JWT authentication</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-primary-600 mb-2">ML Microservice</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>FastAPI (Python)</li>
                <li>Simple rule-based model for prototype</li>
                <li>RESTful API for predictions</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">API Documentation</h2>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Authentication</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <code>POST /api/auth/register</code> - Register a new user
                </li>
                <li>
                  <code>POST /api/auth/login</code> - Login and get JWT token
                </li>
                <li>
                  <code>GET /api/auth/verify</code> - Verify JWT token
                </li>
                <li>
                  <code>POST /api/auth/logout</code> - Logout and clear token
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Patients</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <code>GET /api/patients</code> - Get all patients
                </li>
                <li>
                  <code>GET /api/patients/:id</code> - Get patient by ID
                </li>
                <li>
                  <code>POST /api/patients</code> - Create a new patient
                </li>
                <li>
                  <code>PUT /api/patients/:id</code> - Update a patient
                </li>
                <li>
                  <code>DELETE /api/patients/:id</code> - Delete a patient
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-primary-600 mb-2">ML Service</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <code>POST /predict</code> - Get risk prediction from audio data
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Docs
