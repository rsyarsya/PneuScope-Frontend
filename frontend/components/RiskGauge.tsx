"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface RiskGaugeProps {
  score: number | null
}

function RiskGauge({ score }: RiskGaugeProps) {
  // Define risk levels and colors
  const riskLevels = [
    { level: "Low", threshold: 0.3, color: "#22c55e" },
    { level: "Moderate", threshold: 0.7, color: "#f59e0b" },
    { level: "High", threshold: 1, color: "#ef4444" },
  ]

  // Determine current risk level
  const getRiskLevel = (score: number) => {
    for (const risk of riskLevels) {
      if (score <= risk.threshold) {
        return risk
      }
    }
    return riskLevels[riskLevels.length - 1]
  }

  // Get color for current score
  const getColor = (score: number) => {
    return getRiskLevel(score).color
  }

  // Create data for the gauge chart
  const createGaugeData = (score: number) => {
    return [
      { name: "Score", value: score },
      { name: "Remaining", value: 1 - score },
    ]
  }

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
      {score === null ? (
        <div className="text-gray-500">No risk assessment available. Capture audio data to generate a risk score.</div>
      ) : (
        <>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={createGaugeData(score)}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill={getColor(score)} />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: getColor(score) }}>
              {(score * 100).toFixed(0)}%
            </div>
            <div className="text-gray-600 font-medium">Risk Level: {getRiskLevel(score).level}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default RiskGauge
