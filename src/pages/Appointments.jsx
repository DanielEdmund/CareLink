import { useMemo, useState } from 'react'
import { CalendarPlus, CalendarDays, XCircle, Info } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import AppointmentCard from '@/components/ui/AppointmentCard'
import FilterChip from '@/components/ui/FilterChip'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import CareLinkButton from '@/components/ui/CareLinkButton'
import BookingModal from '@/components/ui/BookingModal'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { useCareLink } from '@/context/CareLinkContext'

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

/** Demo appointment management: view, book, reschedule and cancel. */
export default function Appointments() {
  const {
    appointments,
    cancelAppointment,
    pending,
    setSelectedAppointment,
    joinConsultation,
  } = useCareLink()

  const [tab, setTab] = useState('upcoming')
  const [bookingOpen, setBookingOpen] = useState(false)
  const [rescheduleTarget, setRescheduleTarget] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  const now = Date.now()
  const counts = useMemo(
    () => ({
      upcoming: appointments.filter(
        (a) => (a.status === 'confirmed' || a.status === 'pending') && new Date(a.start).getTime() > now
      ).length,
      past: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }),
    [appointments, now]
  )

  const list = useMemo(() => {
    const upcoming = appointments
      .filter((a) => (a.status === 'confirmed' || a.status === 'pending') && new Date(a.start).getTime() > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
    const past = appointments
      .filter((a) => a.status === 'completed')
      .sort((a, b) => new Date(b.start) - new Date(a.start))
    const cancelled = appointments
      .filter((a) => a.status === 'cancelled')
      .sort((a, b) => new Date(b.start) - new Date(a.start))
    if (tab === 'past') return past
    if (tab === 'cancelled') return cancelled
    return upcoming
  }, [appointments, tab, now])

  async function handleConfirmCancel() {
    if (!cancelTarget) return
    await cancelAppointment(cancelTarget.id)
    setCancelTarget(null)
  }

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Demo schedule"
        title="Appointments"
        subtitle="Every appointment here is simulated. Rescheduling and cancelling only updates local prototype state."
        action={
          <CareLinkButton icon={CalendarPlus} onClick={() => setBookingOpen(true)}>
            Book demo appointment
          </CareLinkButton>
        }
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Appointment status">
        {TABS.map((t) => (
          <FilterChip
            key={t.id}
            active={tab === t.id}
            onClick={() => setTab(t.id)}
            aria-label={`${t.label} appointments`}
          >
            {t.label} ({counts[t.id]})
          </FilterChip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'No upcoming demo appointments' : `No ${tab} appointments`}
          body="Book a sample appointment to see it appear in this list. Nothing here represents a real booking."
          icon={CalendarDays}
          cta={{ label: 'Book a demo appointment' }}
          action={() => setBookingOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {list.map((appointment, i) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              index={i}
              pendingFlags={pending}
              onJoin={async (apt) => {
                setSelectedAppointment(apt)
                await joinConsultation(apt.id)
              }}
              onReschedule={(apt) => setRescheduleTarget(apt)}
              onCancel={(apt) => setCancelTarget(apt)}
              onSelect={(apt) => setSelectedAppointment(apt)}
            />
          ))}
        </div>
      )}

      <SafetyNotice title="Simulated scheduling">
        Demo appointments only. CareLink never contacts a clinic, clinician or payment provider.
      </SafetyNotice>

      {/* Booking */}
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />

      {/* Reschedule */}
      <BookingModal
        open={Boolean(rescheduleTarget)}
        mode="reschedule"
        appointment={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
      />

      {/* Cancel confirmation */}
      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        size="sm"
        title="Cancel demo appointment?"
        subtitle={cancelTarget ? `Reference ${cancelTarget.code}` : ''}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CareLinkButton variant="ghost" onClick={() => setCancelTarget(null)}>
              Keep appointment
            </CareLinkButton>
            <CareLinkButton variant="danger" loading={pending.cancelAppointment} onClick={handleConfirmCancel}>
              Cancel demo appointment
            </CareLinkButton>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FEF3F2]">
            <XCircle className="h-6 w-6 text-status-emergency" aria-hidden="true" />
          </span>
          <div className="text-sm leading-relaxed text-brand-slate">
            <p className="font-semibold text-brand-navy">
              This removes the sample booking from your prototype timeline.
            </p>
            <p className="mt-2 flex items-start gap-2 rounded-xl bg-[#FFFAEB] p-3 text-[13px] text-[#7A2E0E]">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              No real appointment exists, so nothing is lost — and no cancellation fee applies.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
