import Head from "next/head"
import { Book, Code, Database, Zap } from "lucide-react"

export default function Documentation() {
  return (
    <>
      <Head>
        <title>Documentation - PneuScope</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Documentation</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card">
              <Book className="w-8 h-8 text-medical-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
              <p className="text-gray-600 mb-4">
                Learn how to set up and use PneuScope for broncopneumonia detection in your clinical practice.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• System requirements</li>
                <li>• Installation guide</li>
                <li>• First patient setup</li>
                <li>• Basic monitoring workflow</li>
              </ul>
            </div>

            <div className="card">
              <Zap className="w-8 h-8 text-medical-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">Audio Analysis</h2>
              <p className="text-gray-600 mb-4">
                Understand how PneuScope analyzes chest audio data to detect early signs of broncopneumonia.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Audio capture methodology</li>
                <li>• Signal processing pipeline</li>
                <li>• ML risk assessment</li>
                <li>• Interpretation guidelines</li>
              </ul>
            </div>

            <div className="card">
              <Database className="w-8 h-8 text-medical-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">Patient Management</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive guide to managing patient records and monitoring data within PneuScope.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Patient registration</li>
                <li>• Medical history tracking</li>
                <li>• Data export and reports</li>
                <li>• Privacy and compliance</li>
              </ul>
            </div>

            <div className="card">
              <Code className="w-8 h-8 text-medical-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">API Reference</h2>
              <p className="text-gray-600 mb-4">
                Technical documentation for developers integrating with PneuScope's API endpoints.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Authentication</li>
                <li>• Patient endpoints</li>
                <li>• Real-time data streaming</li>
                <li>• ML prediction API</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Prototype Notice</h3>
            <p className="text-yellow-700">
              This is a proof-of-concept demonstration. The current system uses simulated audio data and rule-based risk
              assessment. For production deployment, integrate with actual medical-grade audio sensors and trained
              machine learning models.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
