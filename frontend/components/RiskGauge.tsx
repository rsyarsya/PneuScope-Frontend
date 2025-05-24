interface RiskGaugeProps {
  score: number // 0-1 range
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  const percentage = Math.round(score * 100)
  const rotation = score * 180 - 90 // Convert to gauge rotation

  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { level: "Low", color: "text-green-600", bgColor: "bg-green-100" }
    if (score < 0.7) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "High", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const risk = getRiskLevel(score)

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-48 h-24 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          {/* Progress arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={score < 0.3 ? "#10b981" : score < 0.7 ? "#f59e0b" : "#ef4444"}
            strokeWidth="8"
            strokeDasharray={`${score * 251.2} 251.2`}
            className="transition-all duration-1000"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="80"
            x2="100"
            y2="30"
            stroke="#374151"
            strokeWidth="2"
            transform={`rotate(${rotation} 100 80)`}
            className="transition-transform duration-1000"
          />
          {/* Center dot */}
          <circle cx="100" cy="80" r="4" fill="#374151" />
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">0%</div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500">100%</div>
      </div>

      {/* Risk Level Display */}
      <div className={`px-4 py-2 rounded-full ${risk.bgColor} ${risk.color} font-semibold text-center`}>
        {risk.level} Risk: {percentage}%
      </div>
    </div>
  )
}
