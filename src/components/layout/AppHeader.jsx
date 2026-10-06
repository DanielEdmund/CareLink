import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react'
import Logo from './Logo'
import CareLinkButton from '@/components/ui/CareLinkButton'
import { Avatar } from '@/components/ui/SmartImage'
import { demoUser, demoNotifications } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { cn } from '@/lib/utils'
import { scaleIn, EASE } from '@/lib/motion'

/** Top header — brand, demo search, notifications, cart and account. */
export default function AppHeader({ onSearch }) {
  const navigate = useNavigate()
  const { cart, preferences, dismissToast } = useCareLink()
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setNotifOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div ref={wrapRef} className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="lg:hidden" aria-label="CareLink home">
          <Logo size={32} tagline={false} />
        </Link>

        <div className="hidden lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-aqua">
            Healthcare, Connected Around You
          </p>
          <p className="text-sm font-semibold text-brand-navy">
            Welcome back, {demoUser.preferredName}
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#FFF7E8] px-2 py-0.5 text-[10px] font-bold uppercase text-[#B54708] border border-[#FEDF89]">
              Demo account
            </span>
          </p>
        </div>

        {/* Demo search */}
        <form
          className="relative ml-auto hidden flex-1 max-w-md sm:block"
          onSubmit={(e) => {
            e.preventDefault()
            const value = new FormData(e.currentTarget).get('q')
            onSearch?.(String(value || '').trim())
          }}
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            name="q"
            placeholder="Search doctors, tests, sample records…"
            aria-label="Search the prototype"
            className="cl-input min-h-[44px] pl-10 pr-3 text-[13px]"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
          <span className="hidden items-center gap-1.5 rounded-full bg-brand-mint px-3 py-1.5 text-[11px] font-bold text-[#08615E] md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Simulated — no real services
          </span>

          <Link
            to="/pharmacy"
            aria-label={`Demo cart, ${cartCount} items`}
            className="relative grid h-11 w-11 place-items-center rounded-xl text-brand-slate transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-brand-blue px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v)
                setMenuOpen(false)
              }}
              aria-expanded={notifOpen}
              aria-haspopup="true"
              aria-label="Demo notifications"
              className="relative grid h-11 w-11 place-items-center rounded-xl text-brand-slate transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-2 top-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-emergency px-1 text-[10px] font-bold text-white">
                {demoNotifications.length}
              </span>
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-modal"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-brand-navy">Demo notifications</p>
                    <span className="cl-demo-strip">Sample</span>
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {demoNotifications.map((n) => (
                      <li key={n.id} className="border-b border-slate-50 px-4 py-3 last:border-0">
                        <p className="text-[13px] font-bold text-brand-navy">{n.title}</p>
                        <p className="mt-0.5 text-[12px] leading-snug text-brand-slate">{n.body}</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="w-full px-4 py-3 text-center text-[13px] font-semibold text-brand-blue hover:bg-brand-blue-soft"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v)
                setNotifOpen(false)
              }}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className="flex h-11 items-center gap-2 rounded-xl pl-1 pr-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Avatar src={demoUser.avatar} name={demoUser.name} size="sm" />
              <span className="hidden text-sm font-semibold text-brand-navy sm:block">
                {demoUser.preferredName}
              </span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-modal"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-brand-navy">{demoUser.name}</p>
                    <p className="truncate text-[12px] text-brand-slate">{demoUser.email}</p>
                  </div>
                  <ul className="p-1.5">
                    {[
                      { to: '/profile', label: 'My profile' },
                      { to: '/settings', label: 'Settings' },
                      { to: '/dashboard', label: 'Dashboard' },
                    ].map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-slate transition hover:bg-slate-50 hover:text-brand-navy"
                        >
                          {link.label}
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-slate-100 p-2">
                    <CareLinkButton
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setMenuOpen(false)
                        navigate('/settings')
                      }}
                    >
                      Prototype settings
                    </CareLinkButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-[#FFF7E8] px-4 py-1.5 sm:px-6 lg:px-8">
        <p className={cn('mx-auto max-w-7xl text-center text-[11px] font-semibold text-[#7A2E0E]')}>
          Frontend prototype — all appointments, results, prescriptions and prices are simulated sample
          data. CareLink is not a real healthcare provider.
        </p>
      </div>
    </header>
  )
}
