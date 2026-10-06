import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Clock3, Video, MapPin, CheckCircle2, Info } from 'lucide-react'
import Modal from './Modal'
import CareLinkButton from './CareLinkButton'
import SmartImage from './SmartImage'
import { FormField, TextInput, TextArea, SelectInput } from './FormField'
import { doctors } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { cn, formatDateTime, formatDate } from '@/lib/utils'
import { scaleIn, EASE } from '@/lib/motion'

const toISODate = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

/**
 * BookingModal — books or reschedules a DEMO appointment.
 * Shows a calm confirmation state with a sample reference code.
 */
export default function BookingModal({ open, mode = 'book', doctor, appointment, onClose }) {
  const { bookAppointment, rescheduleAppointment, pending, setSelectedDoctor } = useCareLink()

  const [step, setStep] = useState('form') // form | confirmed
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)
  const [form, setForm] = useState({
    doctorId: doctor?.id || doctors[0].id,
    date: toISODate(Date.now() + 86400000),
    time: '',
    type: 'Video',
    reason: '',
  })

  const activeDoctor = useMemo(() => {
    const targetId = mode === 'reschedule' ? doctor?.id || appointment?.doctorId : form.doctorId
    return doctors.find((d) => d.id === targetId) || doctors[0]
  }, [form.doctorId, doctor, appointment, mode])

  useEffect(() => {
    if (!open) return
    setStep('form')
    setError('')
    setConfirmed(null)
    setForm({
      doctorId: doctor?.id || appointment?.doctorId || doctors[0].id,
      date: toISODate(appointment ? new Date(appointment.start) : Date.now() + 86400000),
      time: '',
      type: appointment?.type || 'Video',
      reason: appointment?.reason?.replace(' (demo)', '') || '',
    })
  }, [open, doctor, appointment, mode])

  const today = toISODate(Date.now())

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.date || !form.time) {
      setError('Please pick a date and a time slot for this demo booking.')
      return
    }

    if (mode === 'reschedule') {
      const res = await rescheduleAppointment(appointment.id, { date: form.date, time: form.time })
      if (res.ok) {
        setConfirmed({ code: appointment.code, start: `${form.date} ${form.time}`, doctor: activeDoctor })
        setStep('confirmed')
      } else {
        setError(res.message)
      }
      return
    }

    const res = await bookAppointment({
      doctor: activeDoctor,
      date: form.date,
      time: form.time,
      type: form.type,
      reason: form.reason,
    })
    if (res.ok) {
      setSelectedDoctor(activeDoctor)
      setConfirmed({ code: res.appointment.code, start: res.appointment.start, doctor: activeDoctor })
      setStep('confirmed')
    } else {
      setError(res.message)
    }
  }

  const isBooking = pending.bookAppointment
  const isRescheduling = pending.rescheduleAppointment

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'reschedule' ? 'Reschedule demo appointment' : 'Book a demo appointment'}
      subtitle={
        mode === 'reschedule'
          ? 'Pick a new sample slot. Nothing about your real schedule changes.'
          : 'Choose a sample doctor, date and slot. No real appointment will be created.'
      }
      footer={
        step === 'form' ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CareLinkButton variant="ghost" onClick={onClose}>
              Cancel
            </CareLinkButton>
            <CareLinkButton
              type="submit"
              form="booking-form"
              loading={isBooking || isRescheduling}
              loadingText={mode === 'reschedule' ? 'Rescheduling…' : 'Booking…'}
            >
              {mode === 'reschedule' ? 'Confirm new slot' : 'Confirm demo booking'}
            </CareLinkButton>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <CareLinkButton variant="secondary" onClick={() => setStep('form')}>
              Edit details
            </CareLinkButton>
            <CareLinkButton variant="primary" onClick={onClose}>
              Done
            </CareLinkButton>
          </div>
        )
      }
    >
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.form
            key="form"
            id="booking-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="space-y-4"
          >
            {/* Doctor preview */}
            <div className="flex items-center gap-3 rounded-2xl bg-brand-blue-soft p-3">
              <SmartImage
                src={activeDoctor.image}
                alt={`${activeDoctor.name} sample photo`}
                initials="DR"
                rounded="rounded-xl"
                className="h-12 w-12"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-brand-navy">{activeDoctor.name}</p>
                <p className="truncate text-[13px] text-brand-slate">
                  {activeDoctor.specialty} · {activeDoctor.hospital}
                </p>
              </div>
              <span className="ml-auto shrink-0 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-brand-blue">
                Demo profile
              </span>
            </div>

            {mode !== 'reschedule' && (
              <FormField label="Choose doctor" hint="Sample profiles only.">
                {({ id }) => (
                  <SelectInput
                    id={id}
                    value={form.doctorId}
                    onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value, time: '' }))}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialty} ({d.city})
                      </option>
                    ))}
                  </SelectInput>
                )}
              </FormField>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date" hint="Any date works in this demo.">
                {({ id }) => (
                  <TextInput
                    id={id}
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                )}
              </FormField>

              <FormField label="Visit type">
                {({ id }) => (
                  <div id={id} role="radiogroup" aria-label="Visit type" className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'Video', icon: Video, label: 'Video (simulated)' },
                      { value: 'In person', icon: MapPin, label: 'In person' },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={form.type === value}
                        onClick={() => setForm((f) => ({ ...f, type: value }))}
                        className={cn(
                          'flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[12px] font-semibold transition',
                          form.type === value
                            ? 'border-brand-blue bg-brand-blue text-white shadow-[0_1px_2px_rgba(16,24,40,0.12)]'
                            : 'border-slate-200 bg-white text-brand-slate hover:border-brand-blue/40 hover:text-brand-blue'
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
            </div>

            <FormField label="Available demo slots" hint="Sample times — they do not reflect real availability.">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Available demo slots">
                {(activeDoctor.slots.length ? activeDoctor.slots : ['10:00 AM', '1:00 PM']).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    role="radio"
                    aria-checked={form.time === slot}
                    onClick={() => setForm((f) => ({ ...f, time: slot }))}
                    className={cn(
                      'flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-semibold transition',
                      form.time === slot
                        ? 'border-brand-aqua bg-brand-aqua text-white'
                        : 'border-slate-200 bg-white text-brand-slate hover:border-brand-aqua/50 hover:text-brand-aqua'
                    )}
                  >
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {slot}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Reason for visit (optional)" hint="Stored locally in this browser session only.">
              {({ id }) => (
                <TextArea
                  id={id}
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  placeholder="e.g. Routine follow-up (demo)"
                  maxLength={160}
                />
              )}
            </FormField>

            {error && (
              <p role="alert" className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2.5 text-[13px] font-semibold text-[#B42318]">
                {error}
              </p>
            )}

            <p className="flex items-start gap-2 rounded-xl bg-[#FFFAEB] px-3 py-2.5 text-[12px] leading-relaxed text-[#7A2E0E]">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              This creates a <strong>demo appointment only</strong>. No clinician, clinic or payment
              provider is contacted.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="confirmed"
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <motion.span
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="grid h-20 w-20 place-items-center rounded-full bg-brand-mint"
            >
              <CheckCircle2 className="h-11 w-11 text-status-success" aria-hidden="true" />
            </motion.span>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">
                {mode === 'reschedule' ? 'Demo appointment rescheduled' : 'Demo appointment confirmed'}
              </h3>
              <p className="mt-1 text-sm text-brand-slate">
                {confirmed?.doctor?.name} ·{' '}
                {typeof confirmed?.start === 'string' && confirmed.start.includes('T')
                  ? formatDateTime(confirmed.start)
                  : confirmed?.start}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-blue">Reference {confirmed?.code}</p>
            </div>
            <div className="w-full rounded-2xl border border-dashed border-brand-blue/40 bg-brand-blue-soft p-3.5 text-[13px] leading-relaxed text-brand-navy">
              This is a simulated confirmation for demonstration purposes.{' '}
              <strong>No real appointment, record or payment</strong> was created.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
