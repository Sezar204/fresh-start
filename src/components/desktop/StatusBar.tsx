import React, { useEffect, useState } from "react"
import { Database, Clock } from "lucide-react"
import { useAppStore } from "@/stores/appStore"
import { formatDistanceToNow } from "date-fns"

export const StatusBar: React.FC = () => {
  const { backendReady, lastBackupAt, lastBackupStatus } = useAppStore()
  const [timeStr, setTimeStr] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getBackupStatusText = () => {
    if (!lastBackupAt) return "No backup yet"
    try {
      const dist = formatDistanceToNow(new Date(lastBackupAt), { addSuffix: true })
      return `Backup: ${dist}`
    } catch {
      return "Backup: Unknown"
    }
  }

  const isBackupRecent = () => {
    if (!lastBackupAt) return false
    const diffHours = (Date.now() - new Date(lastBackupAt).getTime()) / (1000 * 60 * 60)
    return diffHours < 24
  }

  return (
    <div className="h-6 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs px-3 flex items-center justify-between shrink-0 select-none">
      {/* Left: Backup Status */}
      <div className="flex items-center gap-1.5">
        <Database className={`w-3 h-3 ${isBackupRecent() ? "text-emerald-400" : "text-amber-400"}`} />
        <span className={isBackupRecent() ? "text-slate-300" : "text-amber-400"}>
          {getBackupStatusText()}
        </span>
      </div>

      {/* Center: Connectivity */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${backendReady ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
        <span className="text-slate-300 font-medium">
          {backendReady ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Right: Clock */}
      <div className="flex items-center gap-1.5 text-slate-400 font-mono">
        <Clock className="w-3 h-3 text-slate-500" />
        <span>{timeStr}</span>
      </div>
    </div>
  )
}
