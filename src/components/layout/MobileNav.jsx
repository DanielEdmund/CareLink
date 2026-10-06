import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { House, CalendarDays, FolderHeart, ShoppingBag, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

const items = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/health-records', label: 'Records', icon: FolderHeart },
  { to: '/pharmacy', label: 'Pharmacy', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

/** Bottom navigation — the primary mobile experience (< lg). */
export default function MobileNav() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition-colors duration-200',
                  isActive ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      transition={{ duration: 0.25, ease: EASE }}
                      className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand-blue"
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                  <span>{label}</span>
                  <span className="sr-only">{isActive ? '(current page)' : ''}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
