import { Link } from 'react-router-dom'
import DoctorCard from '@/components/ui/DoctorCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { doctors } from '@/data/mockData'
import { ArrowRight } from 'lucide-react'

/** Featured doctor profiles on the home page. */
export default function DoctorsSection({ onBook, onView }) {
  const featured = doctors.slice(0, 3)

  return (
    <section aria-labelledby="doctors-section-heading">
      <SectionHeading
        id="doctors-section-heading"
        eyebrow="Sample care team"
        title="Doctors near you"
        subtitle="Profiles, ratings and fees below are simulated sample data for demonstration."
        action={
          <Link to="/doctors" className="cl-btn cl-btn-secondary cl-btn-sm">
            Browse all doctors <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />
      <div className="mt-5 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((doctor, i) => (
          <DoctorCard key={doctor.id} doctor={doctor} index={i} onBook={onBook} onView={onView} />
        ))}
      </div>
    </section>
  )
}
