import { useEffect, useMemo, useState } from 'react'
import { FlaskConical, CalendarClock, MapPin, ShieldAlert, ClipboardList, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import FilterChip from '@/components/ui/FilterChip'
import TestResultCard from '@/components/ui/TestResultCard'
import { TestResultModal } from '@/components/ui/ResultModals'
import Modal from '@/components/ui/Modal'
import { FormField, TextInput, SelectInput } from '@/components/ui/FormField'
import CareLinkButton from '@/components/ui/CareLinkButton'
import StatusBadge, { DemoTag } from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { useCareLink } from '@/context/CareLinkContext'
import { formatNaira, formatDate, cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

const TABS = [
  { id: 'book', label: 'Book a test' },
  { id: 'results', label: 'Mock results' },
  { id: 'bookings', label: 'My demo bookings' },
]

const toISODate = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

/** Laboratory hub: demo test catalogue, mock results and local bookings. */
export default function Laboratory({ initialTab = 'book' }) {
  const {
    labTests,
    testResults,
    labBookings,
    selectedTestResult,
    closeTestResult,
    openTestResult,
    markResultReviewed,
    bookLabTest,
    pending,
  } = useCareLink()

  const [tab, setTab] = useState(initialTab)
  const [category, setCategory] = useState('All')
  const [target, setTarget] = useState(null)
  const [form, setForm] = useState({ date: toISODate(Date.now() + 86400000), collection: 'Centre collection' })
  const [error, setError] = useState('')

  useEffect(() => setTab(initialTab), [initialTab])

  const categories = useMemo(() => ['All', ...Array.from(new Set(labTests.map((t) => t.category)))], [labTests])
  const visibleTests = category === 'All' ? labTests : labTests.filter((t) => t.category === category)

  async function handleBook(e) {
    e.preventDefault()
    setError('')
    const res = await bookLabTest({ testId: target.id, date: form.date, collection: form.collection })
    if (res.ok) {
      setTarget(null)
      setTab('bookings')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample diagnostics"
        title="Laboratory"
        subtitle="Browse demo tests at sample prices, book a mock collection slot and open simulated results."
        action={<DemoTag>Laboratory demo</DemoTag>}
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Laboratory sections">
        {TABS.map((t) => (
          <FilterChip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id === 'bookings' && labBookings.length > 0 ? ` (${labBookings.length})` : ''}
            {t.id === 'results' ? ` (${testResults.length})` : ''}
          </FilterChip>
        ))}
      </div>

      {/* ------------------------------ BOOK ------------------------------ */}
      {tab === 'book' && (
        <motion.div key="book" variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          <div className="cl-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tests by category">
                {categories.map((c) => (
                  <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </FilterChip>
                ))}
              </div>
              <p aria-live="polite" className="text-[13px] font-semibold text-brand-slate">
                {visibleTests.length} sample test{visibleTests.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleTests.map((test, i) => (
              <motion.li
                key={test.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="cl-card cl-card-hover flex flex-col p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-blue-soft text-brand-blue">
                    <FlaskConical className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <DemoTag>Sample test</DemoTag>
                </div>

                <h3 className="mt-3 text-[15px] font-bold text-brand-navy">{test.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {test.lab} · {test.city}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> {test.turnaround}
                </p>
                <p className="mt-1 text-[13px] text-brand-slate">{test.prep}</p>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                  <p className="text-base font-extrabold text-brand-navy">
                    {formatNaira(test.price)}
                    <span className="ml-1.5 text-[10px] font-bold uppercase text-status-warning">Demo price</span>
                  </p>
                  <CareLinkButton size="sm" variant="primary" onClick={() => setTarget(test)}>
                    Book demo test
                  </CareLinkButton>
                </div>
              </motion.li>
            ))}
          </ul>

          <SafetyNotice title="No real lab is involved" icon={ShieldAlert}>
            Booking a test here only stores a record in local state. No sample is collected, no
            laboratory is notified and no real result will ever appear.
          </SafetyNotice>
        </motion.div>
      )}

      {/* ---------------------------- RESULTS ---------------------------- */}
      {tab === 'results' && (
        <motion.div key="results" variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          {testResults.length === 0 ? (
            <EmptyState
              title="No mock results yet"
              body="Sample results appear here once the demo processing finishes."
              icon={FlaskConical}
            />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {testResults.map((result, i) => (
                <li key={result.id}>
                  <TestResultCard
                    result={result}
                    index={i}
                    pending={pending[`result:${result.id}`]}
                    onOpen={() => openTestResult(result.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          <SafetyNotice title="Interpretation">
            This is a mock test result shown for demonstration purposes. Discuss this sample result
            with a qualified healthcare professional — CareLink never provides a diagnosis.
          </SafetyNotice>
        </motion.div>
      )}

      {/* ---------------------------- BOOKINGS ---------------------------- */}
      {tab === 'bookings' && (
        <motion.div key="bookings" variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          {labBookings.length === 0 ? (
            <EmptyState
              title="No demo lab bookings"
              body="Book a sample test from the catalogue and your mock booking will appear here."
              icon={ClipboardList}
              cta={{ label: 'Browse sample tests' }}
              action={() => setTab('book')}
            />
          ) : (
            <ul className="space-y-3">
              {labBookings.map((booking) => (
                <li key={booking.id} className="cl-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-bold text-brand-navy">{booking.testName}</h3>
                        <StatusBadge status={booking.status} />
                        <DemoTag>Lab booking</DemoTag>
                      </div>
                      <p className="mt-1 text-[13px] text-brand-slate">{booking.lab}</p>
                      <p className="mt-0.5 text-[13px] text-brand-slate">
                        {formatDate(booking.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
                        {booking.collection}
                      </p>
                    </div>
                    <p className="text-[13px] font-semibold text-brand-blue">Ref {booking.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <SafetyNotice title="Simulated booking">
            These entries live only in this browser session and disappear when you reset the
            prototype.
          </SafetyNotice>
        </motion.div>
      )}

      {/* Booking modal */}
      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Book a demo lab test"
        subtitle={target ? `${target.name} · ${target.lab}` : ''}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CareLinkButton variant="ghost" onClick={() => setTarget(null)}>
              Cancel
            </CareLinkButton>
            <CareLinkButton type="submit" form="lab-booking-form" loading={pending.bookLabTest} loadingText="Booking…">
              Create demo booking
            </CareLinkButton>
          </div>
        }
      >
        <form id="lab-booking-form" onSubmit={handleBook} className="space-y-4">
          <div className="cl-card-soft p-3.5 text-[13px] leading-relaxed text-brand-navy">
            <p className="font-bold">{target?.name}</p>
            <p className="mt-0.5 text-brand-slate">{target?.prep}</p>
            <p className="mt-1.5 font-bold">
              {target ? formatNaira(target.price) : ''}{' '}
              <span className="text-[11px] font-bold uppercase text-status-warning">Demo price</span>
            </p>
          </div>

          <FormField label="Preferred date" hint="Any future date works in this demo.">
            {({ id }) => (
              <TextInput
                id={id}
                type="date"
                min={toISODate(Date.now())}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            )}
          </FormField>

          <FormField label="Collection method">
            {({ id }) => (
              <SelectInput
                id={id}
                value={form.collection}
                onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
              >
                <option>Centre collection (sample)</option>
                <option>Home collection — Lagos only (sample)</option>
                <option>Workplace drive (sample)</option>
              </SelectInput>
            )}
          </FormField>

          {error && (
            <p role="alert" className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2.5 text-[13px] font-semibold text-[#B42318]">
              {error}
            </p>
          )}

          <p className={cn('cl-safety-note')}>
            <span>
              This creates a demo booking only — no phlebotomist, courier or laboratory is contacted,
              and no sample will be collected.
            </span>
          </p>
        </form>
      </Modal>

      {/* Result detail */}
      <TestResultModal
        open={Boolean(selectedTestResult)}
        result={selectedTestResult}
        pending={selectedTestResult ? Boolean(pending[`result:${selectedTestResult.id}`]) : false}
        onClose={closeTestResult}
        onMarkReviewed={(id) => {
          markResultReviewed(id)
        }}
      />
    </div>
  )
}
