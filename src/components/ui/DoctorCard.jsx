import { motion } from 'framer-motion'
import { Star, MapPin, Video, Building2, Clock3, ShieldCheck } from 'lucide-react'
import CareLinkButton from './CareLinkButton'
import SmartImage from './SmartImage'
import StatusBadge, { DemoTag } from './StatusBadge'
import { formatNaira, relativeFromNow, cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

/**
 * DoctorCard — sample clinician profile card.
 * Prices are always labelled as demo prices and availability as sample slots.
 */
export default function DoctorCard({ doctor, index = 0, onBook, onView, selected = false }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={index}
      className={cn(
        'cl-card cl-card-hover overflow-hidden flex flex-col',
        selected && 'ring-2 ring-brand-blue border-brand-blue'
      )}
    >
      <div className="relative h-40 bg-brand-blue-soft">
        <SmartImage
          src={doctor.image}
          alt={`${doctor.name} — sample profile photo`}
          rounded="rounded-none"
          className="h-40"
          imgClassName="h-full w-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-navy/70 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-navy">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {doctor.rating.toFixed(1)}
            <span className="font-medium text-brand-slate">({doctor.reviews})</span>
          </span>
          <DemoTag>Sample profile</DemoTag>
        </div>
        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold',
            doctor.accepting ? 'bg-status-success text-white' : 'bg-white/95 text-brand-slate'
          )}
        >
          {doctor.accepting ? '● Accepting demo bookings' : '● Not taking demo bookings'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-bold text-brand-navy">{doctor.name}</h3>
          <p className="text-sm font-semibold text-brand-aqua">{doctor.specialty}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-brand-slate">
            <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {doctor.hospital}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-brand-slate">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {doctor.area}, {doctor.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {doctor.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-brand-slate">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 rounded-xl bg-brand-blue-soft p-3">
          <div>
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              <Clock3 className="h-3 w-3" aria-hidden="true" /> Next slot
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-brand-navy">
              {relativeFromNow(doctor.nextAvailable)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Consult fee</p>
            <p className="mt-0.5 text-[13px] font-semibold text-brand-navy">
              {formatNaira(doctor.fee)}
              <span className="ml-1 text-[10px] font-bold uppercase text-status-warning">Demo price</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <CareLinkButton variant="secondary" size="sm" className="flex-1" onClick={() => onView?.(doctor)}>
            View profile
          </CareLinkButton>
          <CareLinkButton
            variant="primary"
            size="sm"
            className="flex-1"
            disabled={!doctor.accepting}
            onClick={() => onBook?.(doctor)}
            icon={Video}
          >
            {doctor.accepting ? 'Book demo' : 'Unavailable'}
          </CareLinkButton>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Sample information for demonstration only — not medical advice.
        </p>
      </div>
    </motion.article>
  )
}
