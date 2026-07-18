import React from "react"
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

export interface PieChartProps {
  data: { name: string; value: number; color: string }[]
  height?: number
}

export const PieChart: React.FC<PieChartProps> = ({ data, height = 300 }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div style={{ width: "100%", height }} className="relative select-none text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
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
        </RePieChart>
      </ResponsiveContainer>

      {/* Center Total Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <span className="text-2xl font-extrabold text-slate-900">{total}</span>
        <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
      </div>
    </div>
  )
}
