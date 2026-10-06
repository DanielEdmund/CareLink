import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import CareLinkButton from './CareLinkButton'
import { fadeUp } from '@/lib/motion'

/** Friendly empty state with an inline SVG illustration. */
export default function EmptyState({ title, body, action, icon: Icon = Inbox, cta }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="cl-card flex flex-col items-center gap-4 px-6 py-10 text-center"
    >
      <div className="relative grid h-20 w-20 place-items-center rounded-full bg-brand-blue-soft">
        <Icon className="h-9 w-9 text-brand-blue" aria-hidden="true" />
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-brand-blue/25" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-bold text-brand-navy">{title}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-brand-slate">{body}</p>
      </div>
      {(action || cta) && (
        <CareLinkButton variant="secondary" onClick={action} icon={cta?.icon}>
          {cta?.label || 'Continue'}
        </CareLinkButton>
      )}
    </motion.div>
  )
}
