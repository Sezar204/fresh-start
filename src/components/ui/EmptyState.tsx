import React from "react"
import { FolderOpen } from "lucide-react"
import { Button } from "./Button"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No items found",
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      {description && <p className="text-xs text-slate-500 max-w-xs mt-1">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
