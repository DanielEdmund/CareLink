import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '@/components/sections/HeroSection'
import QuickActions from '@/components/sections/QuickActions'
import UpcomingAppointment from '@/components/sections/UpcomingAppointment'
import HealthJourney from '@/components/sections/HealthJourney'
import HealthStats from '@/components/sections/HealthStats'
import DoctorsSection from '@/components/sections/DoctorsSection'
import PharmacySection from '@/components/sections/PharmacySection'
import BookingModal from '@/components/ui/BookingModal'
import DoctorProfileModal from '@/components/ui/DoctorProfileModal'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { useCareLink } from '@/context/CareLinkContext'

/** Marketing-style home that doubles as the prototype's entry point. */
export default function Home() {
  const navigate = useNavigate()
  const { selectedDoctor, setSelectedDoctor } = useCareLink()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="cl-page space-y-12 sm:space-y-14">
      <HeroSection
        onBook={() => setBookingOpen(true)}
        onExplore={() => navigate('/dashboard')}
      />

      <QuickActions />

      <UpcomingAppointment
        onJoin={(appointment) => navigate('/consultation', { state: { appointmentId: appointment.id } })}
        onReschedule={() => navigate('/appointments')}
      />

      <HealthStats />

      <DoctorsSection
        onBook={(doctor) => {
          setSelectedDoctor(doctor)
          setBookingOpen(true)
        }}
        onView={(doctor) => {
          setSelectedDoctor(doctor)
          setProfileOpen(true)
        }}
      />

      <HealthJourney />

      <PharmacySection />

      <SafetyNotice title="Before you explore">
        CareLink is a frontend-only prototype built with local mock data. It does not diagnose,
        prescribe, treat, or provide any real healthcare service. If you have a health concern,
        please speak with a qualified healthcare professional.
      </SafetyNotice>

      <BookingModal
        open={bookingOpen}
        doctor={selectedDoctor}
        onClose={() => setBookingOpen(false)}
      />
      <DoctorProfileModal
        open={profileOpen}
        doctor={selectedDoctor}
        onClose={() => setProfileOpen(false)}
        onBook={(doctor) => {
          setProfileOpen(false)
          setSelectedDoctor(doctor)
          setBookingOpen(true)
        }}
      />
    </div>
  )
}
