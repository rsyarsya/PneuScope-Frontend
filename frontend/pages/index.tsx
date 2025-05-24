import Head from "next/head"
import Link from "next/link"
import { Activity, Shield, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <>
      <Head>
        <title>PneuScope - Early Detection of Broncopneumonia</title>
        <meta
          name="description"
          content="Advanced biomedical IoT solution for early detection of broncopneumonia in toddlers"
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-medical-600 to-medical-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">PneuScope</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Advanced biomedical IoT solution for early detection of broncopneumonia in toddlers through real-time
              chest audio analysis
            </p>
            <div className="space-x-4">
              <Link href="/login" className="btn-primary inline-block">
                Get Started
              </Link>
              <Link
                href="/documentation"
                className="btn-secondary inline-block bg-white text-medical-600 hover:bg-gray-100"
              >
                Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card text-center">
                <Activity className="w-12 h-12 text-medical-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-600">Continuous chest audio capture and analysis</p>
              </div>
              <div className="card text-center">
                <Zap className="w-12 h-12 text-medical-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">Machine learning algorithms for risk assessment</p>
              </div>
              <div className="card text-center">
                <Users className="w-12 h-12 text-medical-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
                <p className="text-gray-600">Comprehensive patient records and history</p>
              </div>
              <div className="card text-center">
                <Shield className="w-12 h-12 text-medical-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
                <p className="text-gray-600">HIPAA-compliant data handling and storage</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join healthcare professionals using PneuScope for early detection
            </p>
            <Link href="/login" className="btn-primary">
              Access Dashboard
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
