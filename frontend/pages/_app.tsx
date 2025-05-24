"use client"

import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  return <Component {...pageProps} isAuthenticated={isAuthenticated} user={user} />
}

export default MyApp
