import Head from "next/head"
import SystemStatus from "@/components/SystemStatus"
import { Server, Database, Cpu, Globe } from "lucide-react"

export default function StatusPage() {
  return (
    <>
      <Head>
        <title>System Status - PneuScope</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">System Status</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <SystemStatus />

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold mb-4">Service Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Frontend</p>
                    <p className="text-sm text-gray-600">Next.js on Vercel</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Server className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Backend API</p>
                    <p className="text-sm text-gray-600">Node.js + Express</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">ML Service</p>
                    <p className="text-sm text-gray-600">FastAPI + Python</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-gray-600">MongoDB Atlas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Deployment Information</h3>
            <div className="text-blue-700 space-y-2">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                <strong>Region:</strong> Global CDN
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
