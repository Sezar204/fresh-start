import React from "react"
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export interface LineChartProps {
  data: any[]
  xKey: string
  lines: { key: string; name: string; color: string; dashed?: boolean }[]
  height?: number
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  lines,
  height = 300,
}) => {
  return (
    <div style={{ width: "100%", height }} className="select-none text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey={xKey} stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F172A",
              borderColor: "#1E293B",
              borderRadius: "8px",
              color: "#F8FAFC",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              strokeDasharray={line.dashed ? "5 5" : undefined}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
