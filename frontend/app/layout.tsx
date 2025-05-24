import type React from "react"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "PneuScope - Early Detection of Bronchopneumonia",
  description: "PneuScope is an IoT solution for early detection of bronchopneumonia in toddlers",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Pastikan CSS dimuat dengan benar */}
        <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
