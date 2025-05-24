"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface RiskGaugeProps {
  score: number | null
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  // Define risk levels and colors
  const getRiskLevel = (score: number) => {
    if (score <= 0.3) return { level: "Low", color: "#22c55e" }
    if (score <= 0.7) return { level: "Moderate", color: "#f59e0b" }
    return { level: "High", color: "#ef4444" }
  }

  // Create data for the gauge chart
  const createGaugeData = (score: number) => {
    return [
      { name: "Score", value: score },
      { name: "Remaining", value: 1 - score },
    ]
  }

  if (score === null) {
    return (
      <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">No Risk Assessment</div>
          <p className="text-sm">Capture and analyze audio data to generate a risk score</p>
        </div>
      </div>
    )
  }

  const riskInfo = getRiskLevel(score)

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
      <div className="h-32 w-full mb-4">
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
              <Cell fill={riskInfo.color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold mb-1" style={{ color: riskInfo.color }}>
          {(score * 100).toFixed(0)}%
        </div>
        <div className="text-gray-600 font-medium">Risk Level: {riskInfo.level}</div>
        <div className="text-xs text-gray-500 mt-2">
          {riskInfo.level === "Low" && "Normal breathing patterns detected"}
          {riskInfo.level === "Moderate" && "Some abnormal sounds detected"}
          {riskInfo.level === "High" && "Significant abnormal sounds detected"}
        </div>
      </div>
    </div>
  )
}
