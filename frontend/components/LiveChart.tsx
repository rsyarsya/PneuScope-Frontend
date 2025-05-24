import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LiveChartProps {
  data: number[]
}

export default function LiveChart({ data }: LiveChartProps) {
  const chartData = data.map((value, index) => ({
    time: index,
    decibels: value,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: "Time (seconds)", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Decibels (dB)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value) => [`${value} dB`, "Audio Level"]}
            labelFormatter={(label) => `Time: ${label}s`}
          />
          <Line
            type="monotone"
            dataKey="decibels"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
