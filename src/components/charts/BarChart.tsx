import React from "react"
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"

export interface BarChartProps {
  data: any[]
  xKey: string
  bars: { key: string; name: string; color: string }[]
  height?: number
  targetLine?: number
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  bars,
  height = 300,
  targetLine,
}) => {
  return (
    <div style={{ width: "100%", height }} className="select-none text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          {targetLine !== undefined && (
            <ReferenceLine
              y={targetLine}
              stroke="#DC2626"
              strokeDasharray="3 3"
              label={{ value: `Target (${targetLine})`, fill: "#DC2626", fontSize: 10 }}
            />
          )}
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
