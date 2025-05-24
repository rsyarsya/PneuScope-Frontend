"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ServiceStatus {
  name: string
  url: string
  status: "online" | "offline" | "checking"
  responseTime?: number
}

export default function SystemStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Backend API",
      url: `${process.env.NEXT_PUBLIC_API_URL}/health`,
      status: "checking",
    },
    {
      name: "ML Service",
      url: `${process.env.NEXT_PUBLIC_ML_API_URL}/health`,
      status: "checking",
    },
  ])

  const checkServiceStatus = async (service: ServiceStatus): Promise<ServiceStatus> => {
    try {
      const startTime = Date.now()
      const response = await fetch(service.url, {
        method: "GET",
        timeout: 5000,
      })
      const responseTime = Date.now() - startTime

      return {
        ...service,
        status: response.ok ? "online" : "offline",
        responseTime: response.ok ? responseTime : undefined,
      }
    } catch (error) {
      return {
        ...service,
        status: "offline",
        responseTime: undefined,
      }
    }
  }

  useEffect(() => {
    const checkAllServices = async () => {
      const updatedServices = await Promise.all(services.map(checkServiceStatus))
      setServices(updatedServices)
    }

    checkAllServices()
    const interval = setInterval(checkAllServices, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "offline":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "offline":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(service.status)}
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                {service.status === "checking" ? "Checking..." : service.status.toUpperCase()}
              </span>
              {service.responseTime && <span className="text-xs text-gray-500">({service.responseTime}ms)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
