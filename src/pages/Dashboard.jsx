import { Link, useNavigate } from 'react-router-dom'
import { CalendarCheck, FlaskConical, Pill, ShoppingBag, ArrowRight, CircleAlert } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import CareLinkCard from '@/components/ui/CareLinkCard'
import CareLinkButton from '@/components/ui/CareLinkButton'
import UpcomingAppointment from '@/components/sections/UpcomingAppointment'
import HealthTimeline from '@/components/ui/HealthTimeline'
import TestResultCard from '@/components/ui/TestResultCard'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { useCareLink } from '@/context/CareLinkContext'
import { demoUser } from '@/data/mockData'
import { formatDate } from '@/lib/utils'

/** Personal dashboard — the prototype's "logged-in" home base. */
export default function Dashboard() {
  const navigate = useNavigate()
  const { appointments, testResults, prescriptions, cart, journey, openTestResult, pending } = useCareLink()

  const upcoming = appointments.filter(
    (a) => (a.status === 'confirmed' || a.status === 'pending') && new Date(a.start) > new Date()
  )
  const readyResults = testResults.filter((r) => r.status === 'ready')
  const activeRx = prescriptions.filter((p) => p.status !== 'collected')
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const summary = [
    { label: 'Upcoming demos', value: upcoming.length, icon: CalendarCheck, to: '/appointments', tone: 'bg-brand-blue-soft text-brand-blue', hint: 'Demo appointments' },
    { label: 'Mock results', value: readyResults.length, icon: FlaskConical, to: '/test-results', tone: 'bg-brand-mint text-[#087A76]', hint: 'Sample reports' },
    { label: 'Active demo Rx', value: activeRx.length, icon: Pill, to: '/prescriptions', tone: 'bg-[#FFF7E8] text-[#B54708]', hint: 'Sample prescriptions' },
    { label: 'Demo cart', value: cartCount, icon: ShoppingBag, to: '/pharmacy', tone: 'bg-slate-100 text-brand-navy', hint: 'Local only' },
  ]

  return (
    <div className="cl-page space-y-8">
      <header>
        <p className="cl-eyebrow">{formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 className="cl-section-title mt-1.5 text-2xl sm:text-3xl">
          Good day, {demoUser.preferredName}
        </h1>
        <p className="cl-section-sub">
          Here is your sample overview. Everything below is simulated content stored in local state.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className="cl-card cl-card-hover flex h-full flex-col gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-2xl font-extrabold tabular-nums text-brand-navy">
                  {item.value}
                </span>
                <span className="block text-[13px] font-semibold text-brand-navy">{item.label}</span>
                <span className="block text-[11px] text-brand-slate">{item.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <UpcomingAppointment
        onJoin={(appointment) => navigate('/consultation', { state: { appointmentId: appointment.id } })}
        onReschedule={() => navigate('/appointments')}
      />

      <section aria-labelledby="dash-results" className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHeading
            id="dash-results"
            eyebrow="Latest"
            title="Recent mock results"
            subtitle="Sample laboratory reports — open one to see how the detail view behaves."
            action={
              <Link to="/test-results" className="cl-btn cl-btn-secondary cl-btn-sm">
                All results <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-4 grid gap-4">
            {readyResults.slice(0, 2).map((result, i) => (
              <TestResultCard
                key={result.id}
                result={result}
                index={i}
                pending={pending[`result:${result.id}`]}
                onOpen={() => openTestResult(result.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <HealthTimeline
            steps={journey}
            title="Care journey"
            subtitle="Simulated progress through a demo care episode."
          />

          <CareLinkCard animate={false} tone="soft" padded>
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-brand-navy">Prototype status</p>
                <p className="mt-1 text-[13px] leading-relaxed text-brand-slate">
                  Frontend only · no backend, no authentication, no real patient data. Use
                  Settings → Reset demo data to restore the starting sample state.
                </p>
                <CareLinkButton size="sm" variant="secondary" className="mt-3" onClick={() => navigate('/settings')}>
                  Open prototype settings
                </CareLinkButton>
              </div>
            </div>
          </CareLinkCard>
        </div>
      </section>

      <SafetyNotice title="Sample data notice">
        This is sample information for demonstration purposes and is not medical advice. CareLink
        does not provide real healthcare services.
      </SafetyNotice>
    </div>
  )
}
