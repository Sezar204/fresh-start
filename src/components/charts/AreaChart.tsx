import React from "react"
import {
  ResponsiveContainer,
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export interface AreaChartProps {
  data: any[]
  xKey: string
  areas: { key: string; name: string; color: string }[]
  height?: number
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  areas,
  height = 300,
}) => {
  return (
    <div style={{ width: "100%", height }} className="select-none text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {areas.map((area) => (
              <linearGradient
                key={area.key}
                id={`grad-${area.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={area.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={area.color} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>
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
          {areas.map((area) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={area.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${area.key})`}
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
