import React from "react"

export interface HealthGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  size = "md",
  showLabel = true,
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score))

  let color = "#DC2626" // red
  let statusText = "CRITICAL"
  if (normalizedScore >= 90) {
    color = "#16A34A" // green
    statusText = "EXCELLENT"
  } else if (normalizedScore >= 75) {
    color = "#1E40AF" // blue
    statusText = "GOOD"
  } else if (normalizedScore >= 60) {
    color = "#D97706" // yellow
    statusText = "WARNING"
  }

  const dimensions = {
    sm: { svgSize: 64, stroke: 6, fontSize: "text-sm", statusSize: "text-[9px]" },
    md: { svgSize: 96, stroke: 8, fontSize: "text-2xl", statusSize: "text-[10px]" },
    lg: { svgSize: 128, stroke: 10, fontSize: "text-3xl", statusSize: "text-xs" },
  }

  const dim = dimensions[size]
  const radius = (dim.svgSize - dim.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center" style={{ width: dim.svgSize, height: dim.svgSize }}>
        <svg width={dim.svgSize} height={dim.svgSize} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={dim.svgSize / 2}
            cy={dim.svgSize / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={dim.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dim.svgSize / 2}
            cy={dim.svgSize / 2}
            r={radius}
            stroke={color}
            strokeWidth={dim.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight text-slate-900 ${dim.fontSize}`}>
            {Math.round(normalizedScore)}
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-1.5 font-bold uppercase tracking-wider ${dim.statusSize}`}
          style={{ color }}
        >
          {statusText}
        </span>
      )}
    </div>
  )
}
