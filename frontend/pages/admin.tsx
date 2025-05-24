"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import type { GetServerSideProps } from "next"
import { useAuth } from "@/contexts/AuthContext"
import { Search, Users, Building, UserCheck, UserX, Eye } from "lucide-react"

interface Doctor {
  _id: string
  name: string
  email: string
  hospitalAffiliation: string
  specialization?: string
  licenseNumber?: string
  phoneNumber?: string
  isActive: boolean
  createdAt: string
}

interface HospitalStat {
  _id: string
  totalDoctors: number
  activeDoctors: number
  specializations: string[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [hospitalStats, setHospitalStats] = useState<HospitalStat[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    hospital: "",
    specialization: "",
    status: "all",
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10,
  })
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showDoctorModal, setShowDoctorModal] = useState(false)

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.hospital && { hospital: filters.hospital }),
        ...(filters.specialization && { specialization: filters.specialization }),
        ...(filters.status !== "all" && { status: filters.status }),
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/doctors?${params}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setDoctors(data.doctors)
        setPagination(data.pagination)
        setHospitalStats(data.hospitalStats)
      }
    } catch (error) {
      console.error("Error loading doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDoctorStatus = async (doctorId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/doctors/${doctorId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        loadDoctors() // Reload the list
      }
    } catch (error) {
      console.error("Error updating doctor status:", error)
    }
  }

  const viewDoctorDetails = async (doctorId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/doctors/${doctorId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const doctor = await response.json()
        setSelectedDoctor(doctor)
        setShowDoctorModal(true)
      }
    } catch (error) {
      console.error("Error loading doctor details:", error)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [pagination.current, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, current: 1 })) // Reset to first page
  }

  const uniqueHospitals = [...new Set(doctors.map((d) => d.hospitalAffiliation))].sort()
  const uniqueSpecializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].sort()

  return (
    <>
      <Head>
        <title>Admin Dashboard - PneuScope</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage doctors and hospital affiliations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold">{doctors.filter((d) => d.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Hospitals</p>
                <p className="text-2xl font-bold">{hospitalStats.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <UserX className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Inactive Doctors</p>
                <p className="text-2xl font-bold">{doctors.filter((d) => !d.isActive).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <select
              className="input-field"
              value={filters.hospital}
              onChange={(e) => handleFilterChange("hospital", e.target.value)}
            >
              <option value="">All Hospitals</option>
              {uniqueHospitals.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.specialization}
              onChange={(e) => handleFilterChange("specialization", e.target.value)}
            >
              <option value="">All Specializations</option>
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Doctors ({pagination.total})</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading doctors...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Doctor</th>
                      <th className="text-left py-3 px-4">Hospital</th>
                      <th className="text-left py-3 px-4">Specialization</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Registered</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-gray-600">{doctor.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{doctor.hospitalAffiliation}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{doctor.specialization || "Not specified"}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doctor.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {doctor.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{new Date(doctor.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewDoctorDetails(doctor._id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleDoctorStatus(doctor._id, doctor.isActive)}
                              className={`p-1 ${
                                doctor.isActive
                                  ? "text-red-600 hover:text-red-800"
                                  : "text-green-600 hover:text-green-800"
                              }`}
                              title={doctor.isActive ? "Deactivate" : "Activate"}
                            >
                              {doctor.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.current - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} doctors
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hospital Statistics */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">Hospital Statistics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitalStats.map((stat) => (
              <div key={stat._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{stat._id}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Total Doctors: {stat.totalDoctors}</p>
                  <p>Active: {stat.activeDoctors}</p>
                  <p>Specializations: {stat.specializations.filter(Boolean).length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Doctor Details</h2>
              <button onClick={() => setShowDoctorModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedDoctor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedDoctor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Affiliation</label>
                  <p className="text-gray-900">{selectedDoctor.hospitalAffiliation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <p className="text-gray-900">{selectedDoctor.specialization || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <p className="text-gray-900">{selectedDoctor.licenseNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">{selectedDoctor.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDoctor.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedDoctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registered</label>
                  <p className="text-gray-900">{new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => toggleDoctorStatus(selectedDoctor._id, selectedDoctor.isActive)}
                  className={`btn-primary ${
                    selectedDoctor.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {selectedDoctor.isActive ? "Deactivate Doctor" : "Activate Doctor"}
                </button>
                <button onClick={() => setShowDoctorModal(false)} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const token = req.cookies.token

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  // In production, verify JWT and check admin role
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    if (payload.role !== "admin") {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      }
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
