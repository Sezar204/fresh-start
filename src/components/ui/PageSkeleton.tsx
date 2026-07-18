import React from "react"

export const PageSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded skeleton" />
          <div className="h-4 w-72 bg-slate-200 rounded skeleton" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-lg skeleton" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded skeleton" />
              <div className="h-8 w-8 bg-slate-200 rounded-lg skeleton" />
            </div>
            <div className="h-8 w-28 bg-slate-200 rounded skeleton" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-sm">
        <div className="h-5 w-40 bg-slate-200 rounded skeleton" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-slate-100 rounded skeleton" />
          ))}
        </div>
      </div>
    </div>
  )
}
