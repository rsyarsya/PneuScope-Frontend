"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

// Konfigurasi tipe User
interface User {
  _id: string
  name: string
  email: string
  role: "doctor" | "parent"
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    setIsLoading(false)
  }, [pathname])

  const handleLogout = () => {
    try {
      // Perform local logout by removing user from localStorage
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      setError("Logout failed. Please try again.")
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-700">PneuScope</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700">
              Home
            </Link>
            <Link href="/docs" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700">
              Documentation
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
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
                  href="/login"
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
                >
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-700 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700">
            Home
          </Link>
          <Link
            href="/docs"
            className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
          >
            Documentation
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
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
                href="/login"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        </div>
      )}
    </nav>
  )
}