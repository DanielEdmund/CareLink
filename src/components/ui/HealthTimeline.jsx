import { motion } from 'framer-motion'
import { Check, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

const stepStyles = {
  completed: {
    node: 'bg-brand-mint border-brand-aqua text-brand-aqua',
    card: 'bg-white',
    label: 'Completed',
    Icon: Check,
  },
  current: {
    node: 'bg-brand-blue border-brand-blue text-white',
    card: 'bg-brand-blue-soft border-[#C7DCFF]',
    label: 'Current step',
    Icon: ArrowRight,
  },
  upcoming: {
    node: 'bg-white border-slate-300 text-slate-400',
    card: 'bg-white',
    label: 'Upcoming',
    Icon: Circle,
  },
}

/**
 * HealthTimeline / journey progress.
 * Status is conveyed by icon + label — never colour alone.
 */
export default function HealthTimeline({ steps = [], title = 'Your care journey', subtitle }) {
  return (
    <section aria-labelledby="journey-heading" className="cl-card p-4 sm:p-6">
      <header className="mb-5">
        <p className="cl-eyebrow">Simulated journey</p>
        <h2 id="journey-heading" className="cl-section-title mt-1.5 text-lg sm:text-xl">
          {title}
        </h2>
        {subtitle && <p className="cl-section-sub">{subtitle}</p>}
      </header>

      <ol className="relative space-y-1">
        <span
          className="absolute left-[22px] top-3 bottom-3 w-px bg-slate-200"
          aria-hidden="true"
        />
        {steps.map((step, i) => {
          const style = stepStyles[step.status] || stepStyles.upcoming
          const Icon = style.Icon
          const isLast = i === steps.length - 1
          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
              className="relative flex gap-4 pb-4 last:pb-0"
            >
              <span
                className={cn(
                  'relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2',
                  style.node
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>

              <div
                className={cn(
                  'flex-1 rounded-2xl border border-slate-200 p-3.5 sm:p-4',
                  style.card,
                  step.status === 'current' && 'shadow-card'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-brand-navy">
                    <span className="sr-only">{style.label}: </span>
                    {step.title}
                  </h3>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold',
                      step.status === 'completed' && 'bg-brand-mint text-[#087A76]',
                      step.status === 'current' && 'bg-brand-blue text-white',
                      step.status === 'upcoming' && 'bg-slate-100 text-brand-slate'
                    )}
                  >
                    {step.status === 'completed' && '✓ '}
                    {step.status === 'current' && '● '}
                    {step.status === 'upcoming' && '○ '}
                    {style.label}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-brand-slate">{step.description}</p>
              </div>
              {!isLast && <span className="sr-only">Step {i + 1} of {steps.length}</span>}
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
