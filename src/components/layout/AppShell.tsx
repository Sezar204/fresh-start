import React from "react"
import { useLocation } from "react-router-dom"
import { TitleBar } from "@/components/desktop/TitleBar"
import { StatusBar } from "@/components/desktop/StatusBar"
import { Sidebar } from "./Sidebar"
import { Notification } from "@/components/ui/Notification"
import { useAppStore } from "@/stores/appStore"

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { currentFactory, sidebarCollapsed } = useAppStore()
  const location = useLocation()
  const isFactoryRoute = location.pathname.startsWith("/factory")

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 select-none">
      {/* TitleBar */}
      <TitleBar />

      {/* Body Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Render Sidebar on factory routes or when factory is active */}
        {(currentFactory || isFactoryRoute) && <Sidebar collapsed={sidebarCollapsed} />}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </main>
      </div>

      {/* StatusBar */}
      <StatusBar />

      {/* Toast Notification Layer */}
      <Notification />
    </div>
  )
}
