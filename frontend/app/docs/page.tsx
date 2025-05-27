export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-700 mb-6">PneuScope Documentation</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">Overview</h2>
            <p className="mb-4">
              PneuScope is an IoT solution designed for early detection of bronchopneumonia in toddlers. This prototype
              demonstrates the frontend functionality, including patient registration, simulated audio capture, and mock
              risk assessment.
            </p>
            <p>
              Note: This version operates entirely on the frontend with mock data, simulating interactions without a
              backend or ML service.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">User Roles</h2>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Doctor</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Register and manage patients</li>
                <li>Simulate audio capture</li>
                <li>View mock risk assessment results</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-primary-600 mb-2">Parent</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>View patient data (mock)</li>
                <li>Access mock risk assessment results</li>
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
                <li>Recharts for data visualization</li>
                <li>Mock data for simulating patient and audio interactions</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">Using the Prototype</h2>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Login</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use demo credentials to log in:</li>
                <li>Doctor: <code>doctor@pneuscope.com</code> / <code>password123</code></li>
                <li>Parent: <code>parent@pneuscope.com</code> / <code>password123</code></li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium text-primary-600 mb-2">Dashboard</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>View a list of mock patients</li>
                <li>Add, edit, or delete patients</li>
                <li>Simulate audio capture with mock data</li>
                <li>View mock risk assessment results</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}