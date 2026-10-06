import { useCallback, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import AppHeader from '@/components/layout/AppHeader'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import Toasts from '@/components/ui/Toasts'

import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Doctors from '@/pages/Doctors'
import Appointments from '@/pages/Appointments'
import Consultation from '@/pages/Consultation'
import Prescriptions from '@/pages/Prescriptions'
import Pharmacy from '@/pages/Pharmacy'
import Laboratory from '@/pages/Laboratory'
import HealthRecords from '@/pages/HealthRecords'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'

import { CareLinkProvider, useCareLink } from '@/context/CareLinkContext'
import { pageVariants } from '@/lib/motion'

function NotFound() {
  return (
    <div className="cl-page">
      <div className="cl-card mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-blue-soft">
          <Compass className="h-7 w-7 text-brand-blue" aria-hidden="true" />
        </span>
        <h1 className="mt-3 text-xl font-bold text-brand-navy">Page not found</h1>
        <p className="mt-2 text-sm text-brand-slate">
          That route does not exist in the CareLink prototype. Use the navigation to keep exploring
          the demo.
        </p>
        <Link to="/" className="cl-btn cl-btn-primary mt-5">Back to home</Link>
      </div>
    </div>
  )
}

/** App shell: sidebar + header + routed page + mobile nav + toasts. */
function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toasts, dismissToast } = useCareLink()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback(
    (value) => {
      setSearchQuery(value)
      if (value) navigate('/doctors', { state: { query: value } })
    },
    [navigate]
  )

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-blue focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onSearch={handleSearch} />

        <main id="main-content" className="flex-1 pb-28 lg:pb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/doctors" element={<Doctors initialQuery={location.state?.query || searchQuery} />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/laboratory" element={<Laboratory key="lab" initialTab="book" />} />
                <Route path="/test-results" element={<Laboratory key="results" initialTab="results" />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/pharmacy" element={<Pharmacy />} />
                <Route path="/health-records" element={<HealthRecords />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <MobileNav />
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default function App() {
  return (
    <CareLinkProvider>
      <Shell />
    </CareLinkProvider>
  )
}
