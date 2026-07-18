import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

export interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  footer?: React.ReactNode
}

export const SlideOver: React.FC<SlideOverProps> = ({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  children,
  footer,
}) => {
  const widths = {
    sm: "max-w-[480px]",
    md: "max-w-[640px]",
    lg: "max-w-[800px]",
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-full bg-white shadow-2xl border-l border-slate-200 focus:outline-none flex flex-col transition-transform duration-300 ease-in-out",
            widths[size]
          )}
        >
          <div className="p-6 border-b border-slate-200 flex items-start justify-between shrink-0 bg-slate-50">
            <div>
              <Dialog.Title className="text-xl font-bold text-slate-900">
                {title}
              </Dialog.Title>
              {subtitle && (
                <Dialog.Description className="text-xs text-slate-500 mt-1">
                  {subtitle}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {footer && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
