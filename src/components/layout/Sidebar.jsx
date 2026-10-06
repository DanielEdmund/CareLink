import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  House,
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  Video,
  Pill,
  FlaskConical,
  ClipboardList,
  FolderHeart,
  ShoppingBag,
  UserRound,
  Settings,
} from 'lucide-react'
import Logo from './Logo'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { demoUser } from '@/data/mockData'
import { Avatar } from '@/components/ui/SmartImage'

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Home', icon: House, end: true },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Care',
    items: [
      { to: '/doctors', label: 'Doctors', icon: Stethoscope },
      { to: '/appointments', label: 'Appointments', icon: CalendarDays },
      { to: '/consultation', label: 'Consultation', icon: Video },
      { to: '/prescriptions', label: 'Prescriptions', icon: Pill },
      { to: '/pharmacy', label: 'Pharmacy', icon: ShoppingBag },
      { to: '/laboratory', label: 'Laboratory', icon: FlaskConical },
      { to: '/health-records', label: 'Health Records', icon: FolderHeart },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: UserRound },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

/** Desktop sidebar (lg and up). Tablet collapses to icons only. */
export default function Sidebar() {
  return (
    <aside
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white/80 backdrop-blur lg:flex lg:w-[248px] xl:w-[268px] lg:overflow-y-auto"
      aria-label="Primary"
    >
      <div className="px-5 py-5">
        <NavLink to="/" aria-label="CareLink home">
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={({ isActive }) => cn('cl-nav-item', isActive && 'cl-nav-item-active')}>
                    {({ isActive }) => (
                      <>
                        <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-brand-blue' : 'text-brand-slate')} aria-hidden="true" />
                        <span className="lg:truncate">{label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl bg-brand-blue-soft p-3.5">
          <p className="cl-demo-strip mb-2">Demo prototype</p>
          <p className="text-[12px] leading-relaxed text-brand-slate">
            Sample data only. CareLink does not provide real healthcare services.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <Avatar src={demoUser.avatar} name={demoUser.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-brand-navy">{demoUser.name}</p>
            <p className="truncate text-[11px] text-brand-slate">Sample account</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

/** Animated sliding indicator used by the mobile header nav (optional). */
export function NavPill({ activeId }) {
  return (
    <motion.span
      layoutId="nav-pill"
      transition={{ duration: 0.25, ease: EASE }}
      className="absolute inset-0 -z-10 rounded-xl bg-white shadow-pill"
      aria-hidden="true"
      data-active={activeId}
    />
  )
}
