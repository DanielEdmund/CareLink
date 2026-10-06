import HealthTimeline from '@/components/ui/HealthTimeline'
import SectionHeading from '@/components/ui/SectionHeading'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { useCareLink } from '@/context/CareLinkContext'

/** Care journey progression — animated, status-icon driven. */
export default function HealthJourney() {
  const { journey } = useCareLink()

  return (
    <section aria-labelledby="journey-section-heading">
      <SectionHeading
        id="journey-section-heading"
        eyebrow="Coordination"
        title="Your health journey"
        subtitle="A calm, step-by-step view of how CareLink connects each part of a care episode — all simulated."
      />
      <div className="mt-4">
        <HealthTimeline
          steps={journey}
          title="Demo care pathway"
          subtitle="Each step below is sample content demonstrating how the interface would guide someone through care."
        />
      </div>
      <SafetyNotice className="mt-3" title="Reminder">
        This journey is a simulated walkthrough. No care was delivered, scheduled or recorded in the
        real world.
      </SafetyNotice>
    </section>
  )
}
