import Link from "next/link"
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">PneuScope</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced IoT solution for early detection of bronchopneumonia in toddlers through real-time audio analysis
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Login / Register
              </Link>
              <Link
                href="#features"
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-gray-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div id="features" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">Real-time Monitoring</h2>
              <p className="text-gray-600">
                Capture and analyze chest audio in real-time to detect early signs of bronchopneumonia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">ML-Powered Analysis</h2>
              <p className="text-gray-600">
                Advanced machine learning algorithms process audio data to provide accurate risk assessment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">Patient Management</h2>
              <p className="text-gray-600">
                Comprehensive patient records and history tracking for healthcare professionals and parents.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">How It Works</h2>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
              <ol className="list-decimal list-inside text-left space-y-4 text-gray-700">
                <li>Doctor registers a patient and creates a profile</li>
                <li>Audio sensor captures chest sounds during check-up</li>
                <li>Real-time analysis detects patterns associated with bronchopneumonia</li>
                <li>Risk assessment is generated and stored in patient history</li>
                <li>Parents can view their child's assessment history and risk scores</li>
              </ol>
            </div>
          </div>

          <footer className="mt-16 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PneuScope. All rights reserved.</p>
            <p className="text-sm mt-1">Prototype for demonstration purposes only.</p>
          </footer>
        </div>
      </div>
    </>
  )
}
