import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import Logo from './Logo'

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/doctors', label: 'Find a doctor (demo)' },
      { to: '/appointments', label: 'Appointments' },
      { to: '/consultation', label: 'Simulated consultation' },
      { to: '/laboratory', label: 'Laboratory (sample)' },
    ],
  },
  {
    title: 'Records',
    links: [
      { to: '/health-records', label: 'Health records' },
      { to: '/prescriptions', label: 'Demo prescriptions' },
      { to: '/pharmacy', label: 'Pharmacy (demo prices)' },
      { to: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Prototype',
    links: [
      { to: '/profile', label: 'Sample profile' },
      { to: '/settings', label: 'Settings' },
      { to: '/settings', label: 'Reset demo data' },
    ],
  },
]

/** Site footer with the standing prototype disclaimer. */
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-slate">
              CareLink is a <strong>frontend-only React prototype</strong> built to demonstrate a
              connected healthcare experience using realistic Nigerian sample data.
            </p>
            <p className="cl-safety-note mt-4">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                No real healthcare services, appointments, prescriptions, laboratory integrations or
                payments are provided. Nothing here is medical advice.
              </span>
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-bold text-brand-navy">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={`${link.to}-${i}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-brand-slate underline-offset-4 transition hover:text-brand-blue hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-slate">
            © {new Date().getFullYear()} CareLink prototype · Healthcare, Connected Around You.
          </p>
          <p className="text-xs text-brand-slate">
            Frontend prototype · All content is sample data
          </p>
        </div>
      </div>
    </footer>
  )
}
