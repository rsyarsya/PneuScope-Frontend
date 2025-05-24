"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LiveChartProps {
  data: number[]
}

export default function LiveChart({ data }: LiveChartProps) {
  // Convert raw data array to format expected by Recharts
  const chartData = data.map((value, index) => ({
    time: index,
    value,
  }))

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">No Audio Data</div>
            <p className="text-sm">Start capture to see real-time audio levels</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
