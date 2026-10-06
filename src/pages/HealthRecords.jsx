import { useMemo, useState } from 'react'
import {
  FolderHeart,
  Search,
  FileText,
  Download,
  FlaskConical,
  Stethoscope,
  ScanLine,
  Pill,
  Syringe,
  CalendarDays,
  X,
  ShieldAlert,
} from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import FilterChip from '@/components/ui/FilterChip'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import SafetyNotice from '@/components/ui/SafetyNotice'
import CareLinkButton from '@/components/ui/CareLinkButton'
import { DemoTag } from '@/components/ui/StatusBadge'
import { FormField, SelectInput } from '@/components/ui/FormField'
import { healthRecords, recordTypes } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { formatDate, cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

const typeIcons = {
  Consultation: Stethoscope,
  Laboratory: FlaskConical,
  Imaging: ScanLine,
  Prescription: Pill,
  Immunisation: Syringe,
}

const typeTones = {
  Consultation: 'bg-brand-blue-soft text-brand-blue',
  Laboratory: 'bg-brand-mint text-[#087A76]',
  Imaging: 'bg-slate-100 text-brand-navy',
  Prescription: 'bg-[#FFF7E8] text-[#B54708]',
  Immunisation: 'bg-[#EEF4FF] text-brand-blue',
}

const years = [
  'All time',
  ...Array.from(
    new Set(healthRecords.map((r) => new Date(r.date).getFullYear().toString()))
  ).sort((a, b) => b - a),
]

/** Sample health records with filtering, preview and export simulation. */
export default function HealthRecords() {
  const { recordFilters, setRecordFilters, pushToast } = useCareLink()
  const [openRecord, setOpenRecord] = useState(null)

  const { type, query, year } = recordFilters

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return healthRecords
      .filter((r) => (type === 'All records' ? true : r.type === type))
      .filter((r) => (year === 'All time' ? true : new Date(r.date).getFullYear().toString() === year))
      .filter((r) => !q || [r.title, r.provider, r.clinician, r.summary].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [type, query, year])

  const hasFilters = type !== 'All records' || year !== 'All time' || query.trim()

  function resetFilters() {
    setRecordFilters({ type: 'All records', query: '', year: 'All time' })
  }

  function simulateExport() {
    pushToast({
      tone: 'info',
      title: 'Demo export prepared',
      message: 'A sample PDF would download here. No real records exist to export.',
    })
  }

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample archive"
        title="Health records"
        subtitle="Fictional notes, reports and scans kept in local state. Filter them the way you would a real archive."
        action={
          <div className="flex gap-2">
            <CareLinkButton variant="secondary" icon={Download} onClick={simulateExport}>
              Export demo file
            </CareLinkButton>
          </div>
        }
      />

      {/* Filters */}
      <div className="cl-card space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setRecordFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search sample records…"
            aria-label="Search health records"
            className="cl-input pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter records by type">
          {recordTypes.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setRecordFilters((f) => ({ ...f, type: t }))}>
              {t}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <FormField label="Period" className="w-full max-w-[220px]">
            {({ id }) => (
              <SelectInput
                id={id}
                value={year}
                onChange={(e) => setRecordFilters((f) => ({ ...f, year: e.target.value }))}
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </SelectInput>
            )}
          </FormField>

          <div className="flex items-center gap-3">
            <p aria-live="polite" className="text-[13px] font-semibold text-brand-slate">
              {results.length} sample record{results.length === 1 ? '' : 's'}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-status-emergency hover:bg-[#FEF3F2]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Records */}
      {results.length === 0 ? (
        <EmptyState
          title="No sample records match"
          body="Adjust the filters to see other fictional records from this demonstration archive."
          icon={FolderHeart}
          cta={{ label: 'Reset filters' }}
          action={resetFilters}
        />
      ) : (
        <ol className="relative space-y-3 border-l-2 border-dashed border-slate-200 pl-5 sm:pl-7">
          {results.map((record, i) => {
            const Icon = typeIcons[record.type] || FileText
            return (
              <motion.li
                key={record.id}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <span
                  className={cn(
                    'absolute -left-[34px] top-4 grid h-9 w-9 place-items-center rounded-full border-2 border-white shadow-pill sm:-left-[42px]',
                    typeTones[record.type]
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>

                <article className="cl-card cl-card-hover p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-bold text-brand-navy">{record.title}</h3>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-brand-slate">
                          {record.type}
                        </span>
                        <DemoTag>Sample record</DemoTag>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(record.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="mt-0.5 text-[13px] text-brand-slate">
                        {record.provider} · {record.clinician}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-brand-slate">{record.summary}</p>
                    </div>

                    <CareLinkButton size="sm" variant="secondary" icon={FileText} onClick={() => setOpenRecord(record)}>
                      Open sample
                    </CareLinkButton>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </ol>
      )}

      <SafetyNotice title="Fictional archive" icon={ShieldAlert}>
        These are sample records for demonstration. CareLink does not store, retrieve or process
        real medical records.
      </SafetyNotice>

      {/* Record detail */}
      <Modal
        open={Boolean(openRecord)}
        onClose={() => setOpenRecord(null)}
        title={openRecord?.title || 'Sample record'}
        subtitle={openRecord ? `${openRecord.type} · ${formatDate(openRecord.date, { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CareLinkButton variant="ghost" onClick={() => setOpenRecord(null)}>
              Close
            </CareLinkButton>
            <CareLinkButton variant="secondary" icon={Download} onClick={simulateExport}>
              Download sample
            </CareLinkButton>
          </div>
        }
      >
        {openRecord && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Provider</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy">{openRecord.provider}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Clinician (sample)</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy">{openRecord.clinician}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Sample document</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy">{openRecord.summary}</p>
              <p className="mt-3 text-[13px] text-brand-slate">Attachment: {openRecord.attachment}</p>
              <div className="mt-3 grid h-24 place-items-center rounded-xl bg-white text-[12px] font-semibold text-slate-400">
                Preview unavailable in the prototype
              </div>
            </div>

            <SafetyNotice title="Sample content">
              This is sample information for demonstration purposes and is not medical advice.
            </SafetyNotice>
          </motion.div>
        )}
      </Modal>
    </div>
  )
}
