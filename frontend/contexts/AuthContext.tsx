"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "guest"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = Cookies.get("token")
    if (token) {
      // In a real app, verify token with backend
      // For demo, decode mock user data
      try {
        const userData = JSON.parse(atob(token.split(".")[1]))
        setUser(userData)
      } catch (error) {
        Cookies.remove("token")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data = await response.json()
    setUser(data.user)
    Cookies.set("token", data.token, { expires: 7 })
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("token")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
