import React, { useEffect } from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { useAppStore } from "@/stores/appStore"

export const Notification: React.FC = () => {
  const { notification, clearNotif } = useAppStore()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotif()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [notification, clearNotif])

  if (!notification) return null

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in max-w-sm w-full">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-sm ${
          bgStyles[notification.type]
        }`}
      >
        <div className="shrink-0">{icons[notification.type]}</div>
        <div className="flex-1 text-xs font-medium leading-relaxed">
          {notification.message}
        </div>
        <button
          onClick={clearNotif}
          className="shrink-0 p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
