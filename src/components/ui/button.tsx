import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer pointer-events-auto"

  const variants = {
    default: "bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500 shadow-sm",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm",
  }

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 pointer-events-none" />
      ) : (
        leftIcon && <span className="shrink-0 pointer-events-none">{leftIcon}</span>
      )}
      <span className="pointer-events-none">{children}</span>
      {!loading && rightIcon && <span className="shrink-0 pointer-events-none">{rightIcon}</span>}
    </button>
  )
}
