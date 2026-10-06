import { motion } from 'framer-motion'
import { Star, MapPin, Building2, Languages, Clock3, ShieldCheck, CalendarPlus, BadgeCheck } from 'lucide-react'
import Modal from './Modal'
import CareLinkButton from './CareLinkButton'
import SmartImage from './SmartImage'
import { DemoTag } from './StatusBadge'
import SafetyNotice from './SafetyNotice'
import { formatNaira, relativeFromNow } from '@/lib/utils'
import { EASE } from '@/lib/motion'

/** Full sample clinician profile with a booking call to action. */
export default function DoctorProfileModal({ open, doctor, onClose, onBook }) {
  if (!doctor) return null

  const stats = [
    { icon: Star, label: 'Rating', value: `${doctor.rating.toFixed(1)} / 5` },
    { icon: BadgeCheck, label: 'Reviews', value: `${doctor.reviews} (sample)` },
    { icon: Clock3, label: 'Experience', value: `${doctor.experienceYears} years` },
    { icon: CalendarPlus, label: 'Next slot', value: relativeFromNow(doctor.nextAvailable) },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={doctor.name}
      subtitle={`${doctor.specialty} · ${doctor.hospital}`}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CareLinkButton variant="ghost" onClick={onClose}>
            Close
          </CareLinkButton>
          <CareLinkButton variant="primary" icon={CalendarPlus} disabled={!doctor.accepting} onClick={() => onBook?.(doctor)}>
            {doctor.accepting ? 'Book demo appointment' : 'Not taking demo bookings'}
          </CareLinkButton>
        </div>
      }
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative shrink-0">
            <SmartImage
              src={doctor.image}
              alt={`${doctor.name} — sample profile photo`}
              initials="DR"
              className="h-40 w-full sm:h-44 sm:w-44"
              imgClassName="h-full w-full object-cover"
            />
            <span className="absolute left-2 top-2">
              <DemoTag>Sample profile</DemoTag>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="cl-eyebrow">{doctor.focus}</p>
            <h3 className="mt-1.5 text-lg font-bold text-brand-navy">{doctor.name}</h3>
            <p className="text-sm font-semibold text-brand-aqua">{doctor.specialty}</p>

            <ul className="mt-3 space-y-1.5 text-[13px] text-brand-slate">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" /> {doctor.hospital}{' '}
                <span className="text-slate-400">({doctor.facilityType})</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" /> {doctor.area}, {doctor.city},{' '}
                {doctor.state}
              </li>
              <li className="flex items-center gap-2">
                <Languages className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" /> {doctor.languages.join(', ')}
              </li>
            </ul>

            <div className="mt-3 flex flex-wrap gap-2">
              {doctor.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-brand-slate">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
              </p>
              <p className="mt-1 text-sm font-bold text-brand-navy">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 cl-card-soft p-4">
          <p className="text-sm font-bold text-brand-navy">About this sample profile</p>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-slate">{doctor.about}</p>
          <p className="mt-3 flex items-center gap-2 text-sm font-extrabold text-brand-navy">
            Consult fee: {formatNaira(doctor.fee)}
            <span className="text-[11px] font-bold uppercase text-status-warning">Demo price</span>
          </p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-brand-navy">Sample availability</p>
          <div className="flex flex-wrap gap-2">
            {doctor.slots.map((slot) => (
              <span
                key={slot}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-brand-slate"
              >
                <Clock3 className="h-3.5 w-3.5 text-brand-aqua" aria-hidden="true" />
                {slot}
              </span>
            ))}
          </div>
        </div>

        <SafetyNotice className="mt-4" title="Prototype notice">
          <ShieldCheck className="hidden" aria-hidden="true" />
          This profile is fictional sample content created for demonstration. CareLink does not
          provide medical services or referrals.
        </SafetyNotice>
      </motion.div>
    </Modal>
  )
}
