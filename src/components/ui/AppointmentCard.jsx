import { motion } from 'framer-motion'
import { CalendarDays, Clock3, MapPin, Video, UserRound, CalendarClock, XCircle, LogIn } from 'lucide-react'
import CareLinkButton from './CareLinkButton'
import StatusBadge, { DemoTag } from './StatusBadge'
import SmartImage from './SmartImage'
import { doctors } from '@/data/mockData'
import { formatDate, formatTime, relativeFromNow, cn } from '@/lib/utils'
import { fadeUp } from '@/lib/motion'

/**
 * AppointmentCard — a single demo appointment with its available actions.
 */
export default function AppointmentCard({
  appointment,
  index = 0,
  onJoin,
  onReschedule,
  onCancel,
  onSelect,
  pendingFlags = {},
  compact = false,
}) {
  const doctor = doctors.find((d) => d.id === appointment.doctorId)
  const isFuture = new Date(appointment.start).getTime() > Date.now()
  const actionable = appointment.status === 'confirmed' || appointment.status === 'pending'

  return (
    <motion.article
      layout
      initial="hidden"
      animate="show"
      variants={fadeUp}
      custom={index}
      className={cn('cl-card overflow-hidden', appointment.status === 'cancelled' && 'opacity-75')}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <SmartImage
            src={doctor?.image}
            alt={doctor ? `${doctor.name} (sample photo)` : 'Sample photo'}
            initials="DR"
            rounded="rounded-xl"
            className="h-14 w-14"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-brand-navy">{doctor?.name || 'Sample clinician'}</h3>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="mt-0.5 text-[13px] text-brand-slate">
              {doctor?.specialty} · {doctor?.hospital}
            </p>
            <p className="mt-1 text-[13px] font-medium text-brand-navy">{appointment.reason}</p>
          </div>
          <DemoTag>Appointment</DemoTag>
        </div>

        <div className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
            <CalendarDays className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            {formatDate(appointment.start, { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
            <Clock3 className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            {formatTime(appointment.start)}
            <span className="font-normal text-brand-slate">· {appointment.durationMins}m</span>
          </p>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
            {appointment.type === 'Video' ? (
              <Video className="h-4 w-4 text-brand-aqua" aria-hidden="true" />
            ) : (
              <MapPin className="h-4 w-4 text-brand-aqua" aria-hidden="true" />
            )}
            {appointment.type}
          </p>
        </div>

        {!compact && (
          <p className="flex items-start gap-2 text-[13px] text-brand-slate">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {appointment.location}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              {isFuture ? 'Starts' : 'Held'} {relativeFromNow(appointment.start)}
            </p>
            <p className="text-[12px] font-semibold text-brand-slate">
              Ref {appointment.code} · Demo only
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {actionable && (
              <CareLinkButton
                size="sm"
                variant={isFuture && appointment.type === 'Video' ? 'aqua' : 'primary'}
                icon={LogIn}
                onClick={() => onJoin?.(appointment)}
                loading={pendingFlags.joinConsultation}
              >
                {isFuture && appointment.type === 'Video' ? 'Open waiting room' : 'View demo'}
              </CareLinkButton>
            )}
            {actionable && (
              <CareLinkButton size="sm" variant="secondary" icon={CalendarClock} onClick={() => onReschedule?.(appointment)}>
                Reschedule
              </CareLinkButton>
            )}
            {actionable && (
              <CareLinkButton size="sm" variant="ghost" icon={XCircle} onClick={() => onCancel?.(appointment)}>
                Cancel
              </CareLinkButton>
            )}
            {!actionable && onSelect && (
              <CareLinkButton size="sm" variant="secondary" icon={UserRound} onClick={() => onSelect?.(appointment)}>
                View details
              </CareLinkButton>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
