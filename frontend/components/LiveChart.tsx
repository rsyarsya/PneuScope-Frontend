"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LiveChartProps {
  data: number[]
}

function LiveChart({ data }: LiveChartProps) {
  // Convert raw data array to format expected by Recharts
  const chartData = data.map((value, index) => ({
    time: index,
    value,
  }))

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available. Start capture to see real-time audio levels.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: "Time (s)", position: "insideBottomRight", offset: -5 }}
              tick={false}
            />
            <YAxis domain={[0, 100]} label={{ value: "Decibel (dB)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value) => [`${value} dB`, "Audio Level"]}
              labelFormatter={(label) => `Time: ${label}s`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0ea5e9"
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

export default LiveChart
