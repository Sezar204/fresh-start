import React, { useEffect, useState } from "react"
import { Factory, CheckCircle2 } from "lucide-react"
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/constants"

interface SplashScreenProps {
  onReady: () => void
}

const STEPS = [
  { label: "Starting services...", duration: 800, progress: 20 },
  { label: "Connecting to database...", duration: 600, progress: 45 },
  { label: "Checking data integrity...", duration: 500, progress: 70 },
  { label: "Loading workspace...", duration: 400, progress: 90 },
  { label: "Ready.", duration: 300, progress: 100 },
]

export const SplashScreen: React.FC<SplashScreenProps> = ({ onReady }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        setCurrentStep(i)
        await new Promise((res) => {
          timeoutId = setTimeout(res, STEPS[i].duration)
        })
      }
      setIsDone(true)
      setTimeout(() => {
        onReady()
      }, 400)
    }

    runSteps()

    return () => clearTimeout(timeoutId)
  }, [onReady])

  const progress = STEPS[currentStep]?.progress ?? 0
  const label = STEPS[currentStep]?.label ?? "Initializing..."

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-900 p-8 text-white select-none">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full text-center">
        {/* Logo Icon */}
        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-700 shadow-xl shadow-blue-900/50">
          <Factory className="w-10 h-10 text-white" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl font-bold tracking-wider text-white mb-2">{APP_NAME}</h1>
        <p className="text-sm text-slate-400 mb-8 font-medium">{APP_TAGLINE}</p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4 border border-slate-700/50">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="flex items-center gap-2 text-sm">
          {isDone ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">{label}</span>
            </>
          ) : (
            <span className="text-slate-400">{label}</span>
          )}
        </div>
      </div>

      {/* Version */}
      <div className="w-full flex justify-end text-xs text-slate-500 font-mono">
        v{APP_VERSION}
      </div>
    </div>
  )
}
