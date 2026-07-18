import React from "react"
import { cn } from "@/utils/cn"

export interface CardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className,
  padding = true,
}) => {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={cn(padding ? "p-5" : "")}>{children}</div>
    </div>
  )
}
