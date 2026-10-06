import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Pill, CalendarDays, Stethoscope, MapPin } from 'lucide-react'
import CareLinkButton from './CareLinkButton'
import StatusBadge, { DemoTag } from './StatusBadge'
import { formatDate, cn } from '@/lib/utils'
import { fadeUp, EASE } from '@/lib/motion'

/**
 * PrescriptionCard — demo prescription with expand/collapse medication list.
 * Never implies a real prescription was issued or dispensed.
 */
export default function PrescriptionCard({ prescription, index = 0, onOpen, onCollect, pending = false }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      layout
      initial="hidden"
      animate="show"
      variants={fadeUp}
      custom={index}
      className="cl-card overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-brand-navy">{prescription.code}</h3>
              <StatusBadge status={prescription.status} />
              <DemoTag>Prescription</DemoTag>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" /> {prescription.doctor}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-slate">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Issued {formatDate(prescription.issued, { day: 'numeric', month: 'long', year: 'numeric' })} ·
              valid to {formatDate(prescription.validUntil, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-slate">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {prescription.pharmacy}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-brand-blue-soft p-3">
          <p className="text-[13px] leading-relaxed text-brand-navy">
            <span className="font-bold">Sample entry:</span> {prescription.diagnosis}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-left text-sm font-semibold text-brand-navy transition hover:border-brand-blue/40 hover:bg-brand-blue-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <span className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand-aqua" aria-hidden="true" />
            {prescription.medications.length} sample medication
            {prescription.medications.length > 1 ? 's' : ''}
          </span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="meds"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <ul className="mt-3 space-y-2">
                {prescription.medications.map((med) => (
                  <li key={med.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-brand-navy">{med.name}</p>
                    <p className="mt-0.5 text-[13px] text-brand-slate">{med.direction}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-brand-slate">
                      <span>Duration: {med.duration}</span>
                      <span>Quantity: {med.quantity}</span>
                      <span>{med.refill}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="cl-safety-note mt-3">
                <span>
                  Demo prescription — sample text only. Do not start, stop or change any real medication
                  without speaking to a qualified healthcare professional.
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap gap-2">
          <CareLinkButton size="sm" variant="secondary" onClick={() => onOpen?.(prescription)}>
            View full demo
          </CareLinkButton>
          {prescription.status === 'ready' && (
            <CareLinkButton size="sm" variant="primary" loading={pending} onClick={() => onCollect?.(prescription)}>
              Mark collected (demo)
            </CareLinkButton>
          )}
        </div>
      </div>
    </motion.article>
  )
}
