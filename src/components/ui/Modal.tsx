import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl border border-slate-200 focus:outline-none max-h-[90vh] flex flex-col animate-fade-in",
            sizes[size]
          )}
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-xs text-slate-500 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="py-4 overflow-y-auto flex-1">{children}</div>

          {footer && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
