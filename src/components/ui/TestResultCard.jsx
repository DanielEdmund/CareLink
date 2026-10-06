import { motion } from 'framer-motion'
import { FlaskConical, CalendarClock, ShieldAlert, Check, TriangleAlert, ArrowDown } from 'lucide-react'
import CareLinkButton from './CareLinkButton'
import StatusBadge, { DemoTag } from './StatusBadge'
import { formatDate, cn } from '@/lib/utils'
import { fadeUp } from '@/lib/motion'

const flagMeta = {
  normal: { label: 'In range', icon: Check, cls: 'bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]' },
  high: { label: 'Above range', icon: TriangleAlert, cls: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]' },
  low: { label: 'Below range', icon: ArrowDown, cls: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]' },
}

/**
 * TestResultCard — a mock laboratory result summary.
 * Flagged markers always carry an icon and an explicit text label.
 */
export default function TestResultCard({ result, index = 0, onOpen, pending = false }) {
  const flagged = result.markers.filter((m) => m.flag !== 'normal')

  return (
    <motion.article
      layout
      initial="hidden"
      animate="show"
      variants={fadeUp}
      custom={index}
      className="cl-card cl-card-hover overflow-hidden"
    >
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-brand-navy">{result.name}</h3>
              <DemoTag>Mock result</DemoTag>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> {result.lab}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-slate">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Collected {formatDate(result.collected, { day: 'numeric', month: 'short', year: 'numeric' })}
              {result.reported &&
                ` · Reported ${formatDate(result.reported, { day: 'numeric', month: 'short' })}`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <StatusBadge status={result.status} />
            <StatusBadge status={result.review} />
          </div>
        </div>

        {result.status === 'ready' && result.markers.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {result.markers.map((m) => {
              const meta = flagMeta[m.flag] || flagMeta.normal
              const FlagIcon = meta.icon
              return (
                <li
                  key={m.name}
                  className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2', meta.cls)}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-bold">{m.name}</span>
                    <span className="text-[11px] font-medium opacity-80">
                      {m.value} {m.unit} · ref {m.range}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold">
                    <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {meta.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {result.status === 'processing' && (
          <p className="rounded-xl bg-[#FFFAEB] px-3 py-2.5 text-[13px] text-[#7A2E0E]">
            <strong>Processing:</strong> this sample result is still being simulated and will appear shortly.
          </p>
        )}

        <p className={cn('cl-safety-note', flagged.length > 0 && 'border-status-warning')}>
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {flagged.length > 0 ? (
              <>
                <strong>Needs review (demo):</strong> {result.summary} Discuss this sample result with a
                qualified healthcare professional.
              </>
            ) : (
              <>
                This is sample information for demonstration purposes and is not medical advice. Discuss
                this sample result with a qualified healthcare professional.
              </>
            )}
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-slate">
            Ref {result.code}
          </p>
          <CareLinkButton size="sm" variant="secondary" loading={pending} onClick={() => onOpen?.(result)}>
            Open mock result
          </CareLinkButton>
        </div>
      </div>
    </motion.article>
  )
}
