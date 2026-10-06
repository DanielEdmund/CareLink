import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clock3, Video, MapPin, ArrowRight, CalendarPlus } from 'lucide-react'
import CareLinkButton from '@/components/ui/CareLinkButton'
import SectionHeading from '@/components/ui/SectionHeading'
import SmartImage from '@/components/ui/SmartImage'
import StatusBadge, { DemoTag } from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import { doctors } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { formatDate, formatTime, relativeFromNow } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

/** Live countdown to the next demo appointment (local state only). */
function useCountdown(iso) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const target = new Date(iso).getTime()
  const diff = Number.isNaN(target) ? 0 : Math.max(0, target - now)
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return { hours, mins, secs }
}

/** Upcoming appointment panel shown on Home and Dashboard. */
export default function UpcomingAppointment({ onJoin, onReschedule }) {
  const { appointments, pending } = useCareLink()
  const navigate = useNavigate()

  const next = useMemo(() => {
    return appointments
      .filter((a) => a.status === 'confirmed' || a.status === 'pending')
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0]
  }, [appointments])

  const countdown = useCountdown(next?.start || Date.now())
  const doctor = doctors.find((d) => d.id === next?.doctorId)

  if (!next) {
    return (
      <section aria-labelledby="upcoming-heading">
        <SectionHeading id="upcoming-heading" eyebrow="Your schedule" title="Next demo appointment" />
        <div className="mt-4">
          <EmptyState
            title="No demo appointments yet"
            body="Book a sample appointment to see it appear here. Nothing you book is a real appointment."
            icon={CalendarPlus}
            cta={{ label: 'Find a doctor (demo)' }}
            action={() => navigate('/doctors')}
          />
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="upcoming-heading">
      <SectionHeading
        id="upcoming-heading"
        eyebrow="Your schedule"
        title="Next demo appointment"
        action={
          <Link
            to="/appointments"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            All appointments <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <motion.article
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="cl-card mt-4 overflow-hidden"
      >
        <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <SmartImage
                src={doctor?.image}
                alt={doctor ? `${doctor.name} sample photo` : 'Sample photo'}
                initials="DR"
                rounded="rounded-2xl"
                className="h-16 w-16"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-brand-navy">{doctor?.name}</h3>
                  <StatusBadge status={next.status} />
                  <DemoTag>Appointment</DemoTag>
                </div>
                <p className="mt-0.5 text-[13px] text-brand-slate">
                  {doctor?.specialty} · {doctor?.hospital}
                </p>
                <p className="mt-1 text-[13px] font-medium text-brand-navy">{next.reason}</p>
              </div>
            </div>

            <dl className="mt-4 grid gap-2 rounded-2xl bg-brand-blue-soft p-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
                <CalendarDays className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                <span>{formatDate(next.start, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
                <Clock3 className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                <span>{formatTime(next.start)}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
                {next.type === 'Video' ? (
                  <Video className="h-4 w-4 text-brand-aqua" aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4 text-brand-aqua" aria-hidden="true" />
                )}
                <span>{next.type} · {next.location}</span>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <CareLinkButton
                variant="aqua"
                icon={Video}
                loading={pending.joinConsultation}
                onClick={() => onJoin?.(next)}
              >
                Open waiting room
              </CareLinkButton>
              <CareLinkButton variant="secondary" icon={CalendarDays} onClick={() => onReschedule?.(next)}>
                Reschedule demo
              </CareLinkButton>
              <Link
                to="/appointments"
                className="cl-btn cl-btn-ghost"
              >
                Manage booking
              </Link>
            </div>
          </div>

          <aside className="flex flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-4 sm:w-[230px] sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">
                Starts {relativeFromNow(next.start)}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-brand-blue">
                {countdown.hours}h {String(countdown.mins).padStart(2, '0')}m{' '}
                {String(countdown.secs).padStart(2, '0')}s
              </p>
              <p className="mt-1 text-[11px] text-brand-slate">Demo countdown</p>
            </div>
            <div className="text-right sm:text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Reference</p>
              <p className="text-[13px] font-semibold text-brand-navy">{next.code}</p>
            </div>
          </aside>
        </div>
      </motion.article>
    </section>
  )
}
