import React from "react"
import { ResponsiveContainer, LineChart as ReLineChart, Line } from "recharts"

export interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "#1E40AF",
  width = 80,
  height = 32,
}) => {
  const chartData = data.map((v, i) => ({ index: i, value: v }))

  return (
    <div style={{ width, height }} className="shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
