import React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "danger" | "info" | "muted" | "outline"
  size?: "sm" | "md"
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "info",
  size = "md",
  dot = false,
  className,
}) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    muted: "bg-slate-100 text-slate-600 border-slate-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  }

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    muted: "bg-slate-400",
    outline: "bg-slate-500",
  }

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1 font-medium",
    md: "text-xs px-2.5 py-1 gap-1.5 font-semibold",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border tracking-wide select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  )
}
