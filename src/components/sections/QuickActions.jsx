import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus, FlaskConical, FolderHeart, Pill, Video, Stethoscope, ArrowUpRight } from 'lucide-react'
import { fadeUp, viewportOnce } from '@/lib/motion'

const actions = [
  { to: '/doctors', icon: CalendarPlus, title: 'Book demo visit', body: 'Sample slots across 8 doctors', tone: 'bg-brand-blue text-white' },
  { to: '/consultation', icon: Video, title: 'Waiting room', body: 'Simulated consultation flow', tone: 'bg-brand-aqua text-white' },
  { to: '/laboratory', icon: FlaskConical, title: 'Book a test', body: 'Mock lab catalogue & results', tone: 'bg-brand-blue-soft text-brand-blue' },
  { to: '/health-records', icon: FolderHeart, title: 'Health records', body: 'Sample notes, scans & reports', tone: 'bg-brand-mint text-[#087A76]' },
  { to: '/pharmacy', icon: Pill, title: 'Pharmacy', body: 'Demo prices, local cart', tone: 'bg-[#FFF7E8] text-[#B54708]' },
  { to: '/doctors', icon: Stethoscope, title: 'Find a doctor', body: 'Nigerian sample profiles', tone: 'bg-slate-100 text-brand-navy' },
]

/** Quick action tiles — the fastest route into the prototype's main flows. */
export default function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="cl-eyebrow">Get started</p>
          <h2 id="quick-actions-heading" className="cl-section-title mt-1.5">
            Quick actions
          </h2>
        </div>
        <Link to="/dashboard" className="hidden items-center gap-1 text-sm font-semibold text-brand-blue hover:underline sm:inline-flex">
          Open dashboard <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {actions.map((action, i) => (
          <motion.li
            key={action.title}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={i}
          >
            <Link
              to={action.to}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${action.tone}`}>
                <action.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-[15px] font-bold text-brand-navy">
                  {action.title}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-brand-slate">{action.body}</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
