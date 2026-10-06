import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

const meta = {
  success: { icon: CheckCircle2, cls: 'border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]' },
  info: { icon: Info, cls: 'border-[#C7DCFF] bg-brand-blue-soft text-brand-blue' },
  warning: { icon: AlertTriangle, cls: 'border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]' },
}

/**
 * Toasts — polite, screen-reader-friendly status messages (role="status").
 */
export default function Toasts({ toasts, onDismiss }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const m = meta[toast.tone] || meta.info
          const Icon = m.icon
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: EASE }}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-3.5 shadow-card-hover',
                m.cls
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-[13px] leading-snug opacity-90">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss message"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}
