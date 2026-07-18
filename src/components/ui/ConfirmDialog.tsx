import React from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { AlertTriangle } from "lucide-react"
import { Button } from "./Button"

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
}) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl border border-slate-200 focus:outline-none animate-fade-in">
          <div className="flex gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                danger ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <AlertDialog.Title className="text-base font-bold text-slate-900">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="text-xs text-slate-600 mt-1 leading-relaxed">
                {message}
              </AlertDialog.Description>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant={danger ? "danger" : "default"}
                size="sm"
                loading={loading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
