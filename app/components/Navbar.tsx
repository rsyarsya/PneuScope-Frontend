"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"

interface User {
  _id: string
  name: string
  email: string
  role: "doctor" | "parent"
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true })
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still remove from localStorage even if API call fails
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    }
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-700">PneuScope</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
                pathname === "/" ? "text-blue-700" : ""
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/parent"}
                  className={`px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
                    pathname.includes("/dashboard") ? "text-blue-700" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                >
                  Logout
                </button>
                <span className="px-3 py-2 text-sm text-gray-500">
                  {user.name} ({user.role})
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className={`px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
                    pathname === "/auth" ? "text-blue-700" : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${
                    pathname === "/auth/register" ? "bg-blue-700" : ""
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
              pathname === "/" ? "text-blue-700" : ""
            }`}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/parent"}
                className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
                  pathname.includes("/dashboard") ? "text-blue-700" : ""
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700"
              >
                Logout
              </button>
              <span className="block px-3 py-2 text-sm text-gray-500">
                {user.name} ({user.role})
              </span>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-700 ${
                  pathname === "/auth" ? "text-blue-700" : ""
                }`}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className={`block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${
                  pathname === "/auth/register" ? "bg-blue-700" : ""
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
