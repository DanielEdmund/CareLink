import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

/**
 * FilterChip — pill filters with an animated active indicator.
 * Selected state is communicated by icon + fill, not colour alone.
 */
export default function FilterChip({ active = false, onClick, children, icon: Icon, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn('cl-chip', active && 'cl-chip-active', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="inline-flex"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </motion.span>
        ) : Icon ? (
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
      </AnimatePresence>
      <span>{children}</span>
    </button>
  )
}
