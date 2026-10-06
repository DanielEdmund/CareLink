import { motion } from 'framer-motion'
import { FlaskConical, CalendarClock, ShieldAlert, CheckCircle2, Pill, Stethoscope, CalendarDays } from 'lucide-react'
import Modal from './Modal'
import CareLinkButton from './CareLinkButton'
import StatusBadge, { DemoTag } from './StatusBadge'
import SafetyNotice from './SafetyNotice'
import { formatDate, cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

const flagStyles = {
  normal: 'bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]',
  high: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]',
  low: 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]',
}
const flagLabels = { normal: '✓ In range', high: '▲ Above range', low: '▼ Below range' }

/** Full mock laboratory result view. */
export function TestResultModal({ open, result, onClose, onMarkReviewed, pending = false }) {
  if (!result) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={result.name}
      subtitle={`Mock test result · ${result.lab}`}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CareLinkButton variant="ghost" onClick={onClose}>
            Close
          </CareLinkButton>
          {result.review === 'needs-review' && (
            <CareLinkButton variant="aqua" icon={CheckCircle2} loading={pending} onClick={() => onMarkReviewed?.(result.id)}>
              Mark as reviewed (demo)
            </CareLinkButton>
          )}
        </div>
      }
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE }}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={result.status} />
          <StatusBadge status={result.review} />
          <DemoTag>Mock result</DemoTag>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> Laboratory
            </dt>
            <dd className="mt-1 text-sm font-semibold text-brand-navy">{result.lab}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Collected
            </dt>
            <dd className="mt-1 text-sm font-semibold text-brand-navy">
              {formatDate(result.collected, { day: 'numeric', month: 'long', year: 'numeric' })}
              {result.reported &&
                ` · reported ${formatDate(result.reported, { day: 'numeric', month: 'long' })}`}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" /> Ordered by
            </dt>
            <dd className="mt-1 text-sm font-semibold text-brand-navy">{result.doctor}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <dt className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Reference</dt>
            <dd className="mt-1 text-sm font-semibold text-brand-navy">{result.code}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-brand-slate">{result.summary}</p>

        {result.markers.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Sample test markers and reference ranges</caption>
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-brand-slate">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-bold">Marker</th>
                  <th scope="col" className="px-3 py-2.5 font-bold">Value</th>
                  <th scope="col" className="px-3 py-2.5 font-bold">Reference</th>
                  <th scope="col" className="px-3 py-2.5 font-bold">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {result.markers.map((m) => (
                  <tr key={m.name}>
                    <th scope="row" className="px-3 py-3 text-[13px] font-semibold text-brand-navy">
                      {m.name}
                    </th>
                    <td className="px-3 py-3 text-[13px] font-bold text-brand-navy">
                      {m.value} <span className="font-medium text-brand-slate">{m.unit}</span>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-brand-slate">{m.range}</td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex rounded-md border px-2 py-1 text-[11px] font-bold', flagStyles[m.flag])}>
                        {flagLabels[m.flag]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <SafetyNotice className="mt-4" title="Important" icon={ShieldAlert}>
          This is a mock test result shown for demonstration purposes.{' '}
          <strong>Discuss this sample result with a qualified healthcare professional.</strong> Nothing
          here should be interpreted as a diagnosis.
        </SafetyNotice>
      </motion.div>
    </Modal>
  )
}

/** Full demo prescription view. */
export function PrescriptionModal({ open, prescription, onClose, onCollect, pending = false }) {
  if (!prescription) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Demo prescription ${prescription.code}`}
      subtitle={`Issued ${formatDate(prescription.issued, { day: 'numeric', month: 'long', year: 'numeric' })} (sample)`}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CareLinkButton variant="ghost" onClick={onClose}>
            Close
          </CareLinkButton>
          {prescription.status === 'ready' && (
            <CareLinkButton variant="primary" loading={pending} onClick={() => onCollect?.(prescription.id)}>
              Mark collected (demo)
            </CareLinkButton>
          )}
        </div>
      }
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE }}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={prescription.status} />
          <DemoTag>Prescription</DemoTag>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" /> Prescriber (sample)
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{prescription.doctor}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Valid until
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">
              {formatDate(prescription.validUntil, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <Pill className="h-3.5 w-3.5" aria-hidden="true" /> Sample pharmacy
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-navy">{prescription.pharmacy}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5">
          {prescription.medications.map((med) => (
            <li key={med.name} className="rounded-2xl border border-slate-200 p-3.5">
              <p className="text-sm font-bold text-brand-navy">{med.name}</p>
              <p className="mt-0.5 text-[13px] text-brand-slate">{med.direction}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-brand-slate">
                <span>Duration: {med.duration}</span>
                <span>Quantity: {med.quantity}</span>
                <span>{med.refill}</span>
              </div>
            </li>
          ))}
        </ul>

        <SafetyNotice className="mt-4" title="Demo only">
          This is sample information for demonstration purposes and is not medical advice. It does not
          represent a real prescription and must not be used to buy or take any medicine.
        </SafetyNotice>
      </motion.div>
    </Modal>
  )
}
