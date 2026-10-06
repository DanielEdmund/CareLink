import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scaleIn, EASE } from '@/lib/motion'

/**
 * Modal — accessible dialog with backdrop, ESC handling, focus-friendly layout
 * and calm scale/fade motion (collapsed under reduced motion).
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  demo = true,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-0 bg-brand-navy/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              'relative w-full sm:w-auto bg-white shadow-modal border border-slate-200 overflow-hidden',
              'rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col',
              widths[size]
            )}
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold text-brand-navy">{title}</h2>
                  {demo && (
                    <span className="cl-demo-strip">Demo</span>
                  )}
                </div>
                {subtitle && <p className="mt-1 text-sm text-brand-slate">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-brand-slate transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">{children}</div>

            {footer && (
              <footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
