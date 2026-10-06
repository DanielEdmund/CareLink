import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarCheck,
  Video,
  ShieldCheck,
  Sparkles,
  Clock3,
} from 'lucide-react'
import CareLinkButton from '@/components/ui/CareLinkButton'
import SafetyNotice from '@/components/ui/SafetyNotice'
import SmartImage from '@/components/ui/SmartImage'
import { LogoMark } from '@/components/layout/Logo'
import { demoUser } from '@/data/mockData'
import { fadeUp, staggerContainer, viewportOnce, EASE } from '@/lib/motion'

const trust = [
  { icon: CalendarCheck, label: 'Demo bookings in seconds' },
  { icon: Video, label: 'Simulated consultations' },
  { icon: ShieldCheck, label: 'Sample data, always labelled' },
]

/** Home hero — brand promise, primary CTA and an illustrative care panel. */
export default function HeroSection({ onBook, onExplore }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#D6E7FF] bg-gradient-to-br from-brand-blue-soft via-white to-brand-mint">
      <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:p-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="min-w-0">
          <motion.p variants={fadeUp} className="cl-eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            CareLink prototype
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-extrabold leading-[1.12] text-brand-navy sm:text-4xl lg:text-[44px]"
          >
            Healthcare,{' '}
            <span className="text-brand-blue">Connected Around You</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-slate sm:text-base">
            Book demo appointments, follow your care journey, review sample test results and browse a
            simulated pharmacy — all in one calm, simple place. Built with realistic Nigerian sample
            data for demonstration.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-3">
            <CareLinkButton size="lg" onClick={onBook} iconRight={ArrowRight}>
              Book a demo appointment
            </CareLinkButton>
            <CareLinkButton size="lg" variant="secondary" onClick={onExplore}>
              Explore the prototype
            </CareLinkButton>
          </motion.div>

          <motion.ul variants={fadeUp} custom={4} className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-navy">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white shadow-pill">
                  <Icon className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} custom={5} className="mt-6">
            <SafetyNotice tone="info" title="Prototype notice">
              CareLink is a frontend prototype. No real healthcare services, records or transactions
              are provided — everything you see is simulated sample content.
            </SafetyNotice>
          </motion.div>
        </motion.div>

        {/* Illustrative care panel (custom SVG + sample photo) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08, ease: EASE }}
          className="relative min-w-0"
        >
          <div className="cl-card relative overflow-hidden p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LogoMark size={32} />
                <div>
                  <p className="text-sm font-bold text-brand-navy">Your care at a glance</p>
                  <p className="text-[11px] text-brand-slate">Sample dashboard preview</p>
                </div>
              </div>
              <span className="cl-badge cl-badge-aqua">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> Live demo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-brand-blue-soft p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Next up</p>
                <p className="mt-1 text-[13px] font-bold text-brand-navy">Dr. Chiamaka Eze</p>
                <p className="text-[12px] text-brand-slate">Today · 2:30 PM (demo)</p>
              </div>
              <div className="rounded-2xl bg-brand-mint p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Results</p>
                <p className="mt-1 text-[13px] font-bold text-brand-navy">1 mock ready</p>
                <p className="text-[12px] text-brand-slate">FBC sample report</p>
              </div>
            </div>

            {/* Custom SVG: gentle heartbeat + connection illustration */}
            <div className="mt-3 min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <svg viewBox="0 0 320 90" className="h-24 w-full min-w-0" role="img" aria-label="Illustration of a steady sample heart-rate line connected to care touchpoints">
                <defs>
                  <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#155EEF" />
                    <stop offset="100%" stopColor="#0E9F9A" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 60h52l10-26 14 44 12-34 10 16h44l12-20 12 26 10-14h56l10-18 12 24 8-10h44"
                  fill="none"
                  stroke="url(#hero-line)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="66" cy="34" r="5" fill="#155EEF" />
                <circle cx="240" cy="42" r="5" fill="#0E9F9A" />
                <circle cx="312" cy="60" r="5" fill="#12B76A" />
              </svg>
              <p className="mt-1 text-center text-[11px] font-semibold text-brand-slate">
                Illustrative sample data — not a real vital-signs reading
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
              <SmartImage
                src={demoUser.avatar}
                alt={`${demoUser.name} sample avatar`}
                initials="AO"
                rounded="rounded-full"
                className="h-10 w-10"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-brand-navy">{demoUser.name}</p>
                <p className="truncate text-[12px] text-brand-slate">Sample account · Lagos, Nigeria</p>
              </div>
              <Link
                to="/profile"
                className="ml-auto shrink-0 rounded-lg px-2.5 py-2 text-[12px] font-bold text-brand-blue hover:bg-brand-blue-soft"
              >
                Open
              </Link>
            </div>
          </div>

          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.3, ease: EASE }}
            className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-[#ABEFC6] bg-white px-3.5 py-2.5 text-[12px] font-bold text-[#027A48] shadow-card-hover sm:block"
          >
            ✓ Demo appointment confirmed
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}
