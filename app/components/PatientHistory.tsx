"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Assessment {
  _id: string
  patientId: string
  audioData: number[]
  riskScore: number
  createdAt: string
}

interface PatientHistoryProps {
  assessments: Assessment[]
}

export default function PatientHistory({ assessments }: PatientHistoryProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  const getRiskLevel = (score: number) => {
    if (score <= 0.3) return { level: "Low", color: "text-green-600", bgColor: "bg-green-100" }
    if (score <= 0.7) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "High", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Prepare chart data for risk score trend
  const trendData = assessments
    .slice()
    .reverse()
    .map((assessment, index) => ({
      assessment: index + 1,
      riskScore: assessment.riskScore * 100,
      date: formatDate(assessment.createdAt),
    }))

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">No Assessment History</div>
          <p className="text-sm">Assessment history will appear here after audio capture and analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Trend Chart */}
      <div>
        <h3 className="text-lg font-medium mb-4">Risk Score Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="assessment"
                label={{ value: "Assessment #", position: "insideBottomRight", offset: -5 }}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                domain={[0, 100]}
                label={{ value: "Risk Score (%)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Risk Score"]}
                labelFormatter={(label) => `Assessment #${label}`}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assessment List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Assessment History</h3>
        <div className="space-y-3">
          {assessments.map((assessment) => {
            const riskInfo = getRiskLevel(assessment.riskScore)
            return (
              <div
                key={assessment._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(assessment.createdAt)}</div>
                    <div className="text-sm text-gray-500 mt-1">Audio samples: {assessment.audioData.length}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${riskInfo.bgColor} ${riskInfo.color}`}
                    >
                      {riskInfo.level} Risk
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      {(assessment.riskScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Assessment Details</h3>
                <button onClick={() => setSelectedAssessment(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Date & Time</h4>
                  <p className="text-gray-600">{formatDate(selectedAssessment.createdAt)}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Risk Assessment</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {(selectedAssessment.riskScore * 100).toFixed(0)}%
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskLevel(selectedAssessment.riskScore).bgColor} ${getRiskLevel(selectedAssessment.riskScore).color}`}
                    >
                      {getRiskLevel(selectedAssessment.riskScore).level} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Audio Data Visualization</h4>
                  <div className="h-48 bg-gray-50 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedAssessment.audioData.map((value, index) => ({
                          time: index,
                          value,
                        }))}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="time"
                          label={{ value: "Time (s)", position: "insideBottomRight", offset: -5 }}
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis
                          domain={[0, 100]}
                          label={{ value: "Decibel (dB)", angle: -90, position: "insideLeft" }}
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <Tooltip
                          formatter={(value) => [`${value} dB`, "Audio Level"]}
                          labelFormatter={(label) => `Time: ${label}s`}
                          contentStyle={{
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                          }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Summary</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Audio samples captured: {selectedAssessment.audioData.length}</p>
                    <p>
                      Average audio level:{" "}
                      {(
                        selectedAssessment.audioData.reduce((a, b) => a + b, 0) / selectedAssessment.audioData.length
                      ).toFixed(1)}{" "}
                      dB
                    </p>
                    <p>Max audio level: {Math.max(...selectedAssessment.audioData)} dB</p>
                    <p>Min audio level: {Math.min(...selectedAssessment.audioData)} dB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
