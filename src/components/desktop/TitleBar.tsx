import React from "react"
import { Factory, Minus, Square, X } from "lucide-react"
import { useAppStore } from "@/stores/appStore"
import { APP_NAME } from "@/constants"

export const TitleBar: React.FC = () => {
  const { currentFactory } = useAppStore()

  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      await getCurrentWindow().minimize()
    } catch {
      // Browser fallback
    }
  }

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      await getCurrentWindow().toggleMaximize()
    } catch {
      // Browser fallback
    }
  }

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      await getCurrentWindow().close()
    } catch {
      // Browser fallback
    }
  }

  return (
    <div
      data-tauri-drag-region
      className="h-10 bg-slate-950 text-slate-200 flex items-center justify-between px-3 select-none border-b border-slate-800 shrink-0"
    >
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide pointer-events-none">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
          <Factory className="w-3 h-3" />
        </div>
        <span className="text-white font-bold">{APP_NAME}</span>
        {currentFactory && (
          <>
            <span className="text-slate-600">—</span>
            <span className="text-slate-300 font-normal truncate max-w-[240px]">
              {currentFactory.name}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-1 -mr-2" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <button
          type="button"
          onClick={handleMinimize}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={handleMaximize}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          title="Maximize"
        >
          <Square className="w-3 h-3 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 hover:bg-red-600 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-3.5 h-3.5 pointer-events-none" />
        </button>
      </div>
    </div>
  )
}
