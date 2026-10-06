import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pill, FlaskConical, ShieldAlert, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PrescriptionCard from '@/components/ui/PrescriptionCard'
import { PrescriptionModal } from '@/components/ui/ResultModals'
import FilterChip from '@/components/ui/FilterChip'
import EmptyState from '@/components/ui/EmptyState'
import SafetyNotice from '@/components/ui/SafetyNotice'
import CareLinkButton from '@/components/ui/CareLinkButton'
import { useCareLink } from '@/context/CareLinkContext'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'collected', label: 'Collected' },
  { id: 'expiring', label: 'Expiring' },
]

/** Demo prescriptions — list, detail view and local status updates. */
export default function Prescriptions() {
  const {
    prescriptions,
    selectedPrescription,
    closePrescription,
    openPrescription,
    markPrescriptionCollected,
    pending,
  } = useCareLink()

  const [tab, setTab] = useState('all')

  const counts = useMemo(
    () => ({
      all: prescriptions.length,
      ready: prescriptions.filter((p) => p.status === 'ready').length,
      collected: prescriptions.filter((p) => p.status === 'collected').length,
      expiring: prescriptions.filter((p) => p.status === 'expiring').length,
    }),
    [prescriptions]
  )

  const list = useMemo(() => {
    if (tab === 'all') return prescriptions
    return prescriptions.filter((p) => p.status === tab)
  }, [prescriptions, tab])

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample medication plans"
        title="Prescriptions"
        subtitle="Demo prescriptions with sample medication text. Nothing here is a real prescription or recommendation."
        action={
          <Link to="/pharmacy" className="cl-btn cl-btn-secondary cl-btn-sm">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Open demo pharmacy
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter prescriptions">
        {TABS.map((t) => (
          <FilterChip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label} ({counts[t.id]})
          </FilterChip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="No demo prescriptions here"
          body="Sample prescriptions you book in this prototype will appear in this list."
          icon={Pill}
          cta={{ label: 'View all demo prescriptions' }}
          action={() => setTab('all')}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((prescription, i) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              index={i}
              pending={pending[`rx:${prescription.id}`]}
              onOpen={(rx) => openPrescription(rx.id)}
              onCollect={(rx) => markPrescriptionCollected(rx.id)}
            />
          ))}
        </div>
      )}

      <div className="cl-card-soft flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-brand-navy">Never treat demo text as real guidance</p>
            <p className="mt-1 text-[13px] leading-relaxed text-brand-slate">
              Do not start, stop or change any real medication based on this prototype. Always speak
              with a qualified healthcare professional.
            </p>
          </div>
        </div>
        <CareLinkButton
          variant="secondary"
          iconRight={ArrowRight}
          onClick={() => document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Back to top
        </CareLinkButton>
      </div>

      <SafetyNotice title="Prototype notice">
        This is sample information for demonstration purposes and is not medical advice. CareLink
        never issues, dispenses or validates prescriptions.
      </SafetyNotice>

      <PrescriptionModal
        open={Boolean(selectedPrescription)}
        prescription={selectedPrescription}
        pending={selectedPrescription ? Boolean(pending[`rx:${selectedPrescription.id}`]) : false}
        onClose={closePrescription}
        onCollect={(id) => {
          markPrescriptionCollected(id)
          closePrescription()
        }}
      />
    </div>
  )
}
