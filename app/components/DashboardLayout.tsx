"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  role: "doctor" | "parent"
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-blue-700">{title}</h1>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <Link
              href={role === "doctor" ? "/dashboard/doctor" : "/dashboard/parent"}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
