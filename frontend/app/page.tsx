import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">PneuScope</h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced IoT solution for early detection of bronchopneumonia in toddlers
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/login"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              Login
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-md hover:bg-gray-50 transition"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Real-time Monitoring</h2>
            <p className="text-gray-600">
              Capture and analyze chest audio in real-time to detect early signs of bronchopneumonia.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">ML-Powered Analysis</h2>
            <p className="text-gray-600">
              Advanced machine learning algorithms process audio data to provide accurate risk assessment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Patient Management</h2>
            <p className="text-gray-600">
              Comprehensive patient records and history tracking for healthcare professionals.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} PneuScope. All rights reserved.</p>
          <p className="text-sm mt-2">Prototype for demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
