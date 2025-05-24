"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User, Settings, Building } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-medical-600">
            PneuScope
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-medical-600">
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-gray-700 hover:text-medical-600 flex items-center space-x-1">
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{user.role}</span>
                      {user.hospitalAffiliation && (
                        <>
                          <Building className="w-3 h-3" />
                          <span className="truncate max-w-32" title={user.hospitalAffiliation}>
                            {user.hospitalAffiliation}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
