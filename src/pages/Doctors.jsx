import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, SlidersHorizontal, Stethoscope, X } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import DoctorCard from '@/components/ui/DoctorCard'
import FilterChip from '@/components/ui/FilterChip'
import EmptyState from '@/components/ui/EmptyState'
import CareLinkButton from '@/components/ui/CareLinkButton'
import BookingModal from '@/components/ui/BookingModal'
import DoctorProfileModal from '@/components/ui/DoctorProfileModal'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { doctors, specialtyOptions, cityOptions } from '@/data/mockData'
import { useMockHealth } from '@/hooks/useMockHealth'
import { motion } from 'framer-motion'
import { listStagger, fadeUp } from '@/lib/motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/** Skeleton tile shown while the mock service "loads" sample doctors. */
function DoctorSkeleton() {
  return (
    <li className="cl-card overflow-hidden" aria-hidden="true">
      <div className="cl-skeleton h-40 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="cl-skeleton h-4 w-2/3" />
        <div className="cl-skeleton h-3 w-1/2" />
        <div className="cl-skeleton h-3 w-3/4" />
        <div className="cl-skeleton h-12 w-full" />
        <div className="flex gap-2">
          <div className="cl-skeleton h-9 flex-1" />
          <div className="cl-skeleton h-9 flex-1" />
        </div>
      </div>
    </li>
  )
}

/** Doctor directory with demo search and filters. */
export default function Doctors({ initialQuery = '' }) {
  const location = useLocation()
  const { selectedDoctor, setSelectedDoctor, loading, error, refetch } = useMockHealth()

  const [query, setQuery] = useState(initialQuery)
  const [specialty, setSpecialty] = useState('All specialties')
  const [city, setCity] = useState('All cities')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const incoming = location.state?.query
    if (incoming) setQuery(incoming)
  }, [location.state])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return doctors.filter((d) => {
      const matchesQuery =
        !q ||
        [d.name, d.specialty, d.hospital, d.city, d.area].some((field) =>
          field.toLowerCase().includes(q)
        )
      const matchesSpecialty = specialty === 'All specialties' || d.specialty === specialty
      const matchesCity = city === 'All cities' || d.city === city
      const matchesAvailability = !availableOnly || d.accepting
      return matchesQuery && matchesSpecialty && matchesCity && matchesAvailability
    })
  }, [query, specialty, city, availableOnly])

  const hasFilters = query || specialty !== 'All specialties' || city !== 'All cities' || availableOnly

  function resetFilters() {
    setQuery('')
    setSpecialty('All specialties')
    setCity('All cities')
    setAvailableOnly(false)
  }

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample directory"
        title="Find a doctor"
        subtitle="Browse fictional clinician profiles from across Nigeria. Availability, ratings and fees are simulated sample data."
      />

      {/* Search + filters */}
      <div className="cl-card space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, specialty, hospital or city…"
            aria-label="Search doctors"
            className="cl-input pl-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-brand-slate hover:bg-slate-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-2 hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-slate sm:flex">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filters
          </span>
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
              {specialtyOptions.map((option) => (
                <FilterChip
                  key={option}
                  active={specialty === option}
                  onClick={() => setSpecialty(option)}
                >
                  {option}
                </FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by city">
              {cityOptions.map((option) => (
                <FilterChip key={option} active={city === option} onClick={() => setCity(option)}>
                  {option}
                </FilterChip>
              ))}
              <FilterChip active={availableOnly} onClick={() => setAvailableOnly((v) => !v)} icon={Stethoscope}>
                Accepting demo bookings
              </FilterChip>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-status-emergency hover:bg-[#FEF3F2]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" /> Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        <p aria-live="polite" className="text-[13px] font-semibold text-brand-slate">
          {loading ? 'Loading sample doctors…' : `${results.length} sample doctor${results.length === 1 ? '' : 's'} found`}
          {!loading && hasFilters ? ' with the current filters' : ''}
        </p>
      </div>

      {error && (
        <div className="cl-card flex flex-wrap items-center justify-between gap-3 border-[#FECDCA] bg-[#FEF3F2] p-4" role="alert">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#B42318]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {error}
          </p>
          <CareLinkButton size="sm" variant="secondary" icon={RefreshCw} onClick={refetch}>
            Retry sample load
          </CareLinkButton>
        </div>
      )}

      {loading ? (
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
          <li className="sr-only">Loading sample doctors…</li>
          {Array.from({ length: 6 }).map((_, i) => (
            <DoctorSkeleton key={i} />
          ))}
        </ul>
      ) : results.length === 0 ? (
        <EmptyState
          title="No sample doctors match"
          body="Try clearing a filter or searching a different specialty — this directory only contains fictional demo profiles."
          icon={Stethoscope}
          cta={{ label: 'Reset filters' }}
          action={resetFilters}
        />
      ) : (
        <motion.ul
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {results.map((doctor, i) => (
            <motion.li key={doctor.id} variants={fadeUp} custom={i}>
              <DoctorCard
                doctor={doctor}
                index={i}
                selected={selectedDoctor?.id === doctor.id}
                onBook={(d) => {
                  setSelectedDoctor(d)
                  setBookingOpen(true)
                }}
                onView={(d) => {
                  setSelectedDoctor(d)
                  setProfileOpen(true)
                }}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}

      <SafetyNotice title="Fictional profiles">
        Every doctor, hospital, rating and fee shown here is invented for demonstration. CareLink
        does not refer patients or provide medical services.
      </SafetyNotice>

      <BookingModal open={bookingOpen} doctor={selectedDoctor} onClose={() => setBookingOpen(false)} />
      <DoctorProfileModal
        open={profileOpen}
        doctor={selectedDoctor}
        onClose={() => setProfileOpen(false)}
        onBook={(d) => {
          setProfileOpen(false)
          setSelectedDoctor(d)
          setBookingOpen(true)
        }}
      />
    </div>
  )
}
