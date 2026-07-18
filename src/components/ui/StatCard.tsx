import React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/utils/cn"

export interface StatCardProps {
  label: string
  value: React.ReactNode
  unit?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "amber" | "red" | "purple" | "slate"
  trend?: "up" | "down"
  trendValue?: string
  onClick?: () => void
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  color = "blue",
  trend,
  trendValue,
  onClick,
  className,
}) => {
  const iconColors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-700",
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={cn("p-2.5 rounded-lg shrink-0", iconColors[color])}>
            {icon}
          </div>
        )}
      </div>

      {(trend || trendValue) && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs">
          {trend === "up" ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          ) : trend === "down" ? (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
          ) : null}
          <span
            className={
              trend === "up"
                ? "text-emerald-700 font-semibold"
                : trend === "down"
                ? "text-red-700 font-semibold"
                : "text-slate-500 font-medium"
            }
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
