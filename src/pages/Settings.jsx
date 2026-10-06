import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Bell,
  Globe,
  ShieldCheck,
  RotateCcw,
  Info,
  Sparkles,
  Accessibility,
} from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import CareLinkCard from '@/components/ui/CareLinkCard'
import CareLinkButton from '@/components/ui/CareLinkButton'
import Modal from '@/components/ui/Modal'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { Toggle, FormField, SelectInput } from '@/components/ui/FormField'
import { DemoTag } from '@/components/ui/StatusBadge'
import { useCareLink } from '@/context/CareLinkContext'
import { cn } from '@/lib/utils'

const palette = [
  { name: 'Deep Medical Blue', hex: '#155EEF', use: 'Primary actions, trust' },
  { name: 'Aqua Teal', hex: '#0E9F9A', use: 'Progress, calm feedback' },
  { name: 'Soft Sky', hex: '#E8F3FF', use: 'Information panels' },
  { name: 'Mint', hex: '#E7F8F3', use: 'Completed states' },
  { name: 'Dark Navy', hex: '#101828', use: 'Headings' },
  { name: 'Slate', hex: '#475467', use: 'Supporting text' },
  { name: 'Success', hex: '#12B76A', use: 'Positive status + icon' },
  { name: 'Warning', hex: '#F79009', use: 'Attention status + icon' },
  { name: 'Emergency', hex: '#D92D20', use: 'Urgent status + icon' },
]

const stack = ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lucide React', 'Recharts', 'Local mock data']

/** Prototype settings: preferences, accessibility and demo data controls. */
export default function Settings() {
  const { preferences, setPreferences, resetDemo, pushToast } = useCareLink()
  const [confirmReset, setConfirmReset] = useState(false)

  function update(key, value) {
    setPreferences((p) => ({ ...p, [key]: value }))
    pushToast({
      tone: 'info',
      title: 'Preference updated',
      message: 'Saved locally for this session only.',
    })
  }

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Preferences"
        title="Settings"
        subtitle="Tune the prototype experience. Preferences live in local React state and reset on reload."
        action={<DemoTag>Local only</DemoTag>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Accessibility */}
        <CareLinkCard animate={false} padded>
          <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
            <Accessibility className="h-4 w-4 text-brand-blue" aria-hidden="true" /> Accessibility
          </h3>
          <div className="mt-1 divide-y divide-slate-100">
            <Toggle
              checked={preferences.reduceMotion}
              onChange={(v) => update('reduceMotion', v)}
              label="Reduce motion"
              description="Minimise transitions and animations across the prototype."
            />
            <Toggle
              checked={preferences.highContrastFallback ?? false}
              onChange={(v) => update('highContrastFallback', v)}
              label="Emphasise high-contrast surfaces"
              description="Adds a subtle outline to cards for stronger separation."
            />
          </div>
          <p className="cl-help">
            The app also honours your operating system’s “reduce motion” setting automatically.
          </p>
        </CareLinkCard>

        {/* Notifications */}
        <CareLinkCard animate={false} padded>
          <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
            <Bell className="h-4 w-4 text-brand-blue" aria-hidden="true" /> Notifications (simulated)
          </h3>
          <div className="mt-1 divide-y divide-slate-100">
            <Toggle
              checked={preferences.pushNotifications}
              onChange={(v) => update('pushNotifications', v)}
              label="In-app demo alerts"
              description="Show simulated confirmations for bookings and orders."
            />
            <Toggle
              checked={preferences.smsReminders}
              onChange={(v) => update('smsReminders', v)}
              label="Sample SMS reminders"
              description="Displays a mock reminder banner — no SMS is ever sent."
            />
            <Toggle
              checked={preferences.emailSummaries}
              onChange={(v) => update('emailSummaries', v)}
              label="Weekly demo summary"
              description="Simulated email digest of your sample activity."
            />
          </div>
        </CareLinkCard>

        {/* Language & units */}
        <CareLinkCard animate={false} padded>
          <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
            <Globe className="h-4 w-4 text-brand-blue" aria-hidden="true" /> Language & units
          </h3>
          <div className="mt-3 space-y-4">
            <FormField label="Language">
              {({ id }) => (
                <SelectInput
                  id={id}
                  value={preferences.language}
                  onChange={(e) => update('language', e.target.value)}
                >
                  <option>English (Nigeria)</option>
                  <option>Yoruba (sample)</option>
                  <option>Igbo (sample)</option>
                  <option>Hausa (sample)</option>
                  <option>Nigerian Pidgin (sample)</option>
                </SelectInput>
              )}
            </FormField>
            <FormField label="Measurement units">
              {({ id }) => (
                <SelectInput
                  id={id}
                  value={preferences.units}
                  onChange={(e) => update('units', e.target.value)}
                >
                  <option>Metric (kg, cm)</option>
                  <option>Imperial (lb, ft) — sample</option>
                </SelectInput>
              )}
            </FormField>
            <FormField label="Accent colour">
              {({ id }) => (
                <SelectInput
                  id={id}
                  value={preferences.themeAccent}
                  onChange={(e) => update('themeAccent', e.target.value)}
                >
                  <option>Deep Medical Blue</option>
                  <option>Aqua Teal</option>
                </SelectInput>
              )}
            </FormField>
          </div>
        </CareLinkCard>

        {/* Privacy */}
        <CareLinkCard animate={false} padded>
          <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
            <ShieldCheck className="h-4 w-4 text-brand-blue" aria-hidden="true" /> Privacy (prototype)
          </h3>
          <div className="mt-1 divide-y divide-slate-100">
            <Toggle
              checked={preferences.shareAnonymousData}
              onChange={(v) => update('shareAnonymousData', v)}
              label="Share anonymous usage data"
              description="No analytics exist in this prototype — the switch is demonstrative."
            />
          </div>
          <div className="cl-card-mint mt-3 p-3.5">
            <p className="text-[13px] font-bold text-[#08615E]">No data leaves your browser</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#08615E]/90">
              CareLink has no backend, no database and no authentication. Closing the tab ends the
              session.
            </p>
          </div>
        </CareLinkCard>
      </div>

      {/* Design system */}
      <CareLinkCard animate={false} padded>
        <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
          <Palette className="h-4 w-4 text-brand-blue" aria-hidden="true" /> CareLink colour system
        </h3>
        <p className="cl-section-sub">
          Colour is always paired with text and icons — never used alone to communicate healthcare
          status.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {palette.map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
              <span
                className="h-9 w-9 shrink-0 rounded-lg border border-black/10"
                style={{ background: c.hex }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-brand-navy">{c.name}</span>
                <span className="block truncate text-[11px] text-brand-slate">
                  {c.hex} · {c.use}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CareLinkCard>

      {/* Prototype info + reset */}
      <CareLinkCard animate={false} padded>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
              <Info className="h-4 w-4 text-brand-blue" aria-hidden="true" /> About this prototype
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-slate">
              CareLink — <strong>Healthcare, Connected Around You</strong> — is a frontend-only
              demonstration. It simulates appointments, consultations, results, prescriptions,
              pharmacy orders and records using local mock data with realistic Nigerian context.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {stack.map((tech) => (
                <li key={tech} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-brand-slate">
                  {tech}
                </li>
              ))}
            </ul>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-blue-soft px-3 py-1.5 text-[12px] font-bold text-brand-blue">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> No backend · No real healthcare
              integrations
            </p>
          </div>

          <CareLinkButton variant="danger" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
            Reset demo data
          </CareLinkButton>
        </div>
      </CareLinkCard>

      <SafetyNotice title="Healthcare safety">
        CareLink does not diagnose conditions, predict disease, recommend medication changes or
        create real healthcare transactions. Always consult a qualified healthcare professional for
        real medical concerns.
      </SafetyNotice>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        size="sm"
        title="Reset the prototype?"
        subtitle="Sample data will be restored to its starting state."
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CareLinkButton variant="ghost" onClick={() => setConfirmReset(false)}>
              Keep my demo state
            </CareLinkButton>
            <CareLinkButton
              variant="danger"
              icon={RotateCcw}
              onClick={() => {
                resetDemo()
                setConfirmReset(false)
              }}
            >
              Yes, reset demo data
            </CareLinkButton>
          </div>
        }
      >
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm leading-relaxed text-brand-slate">
          This clears local prototype state: demo appointments, cart items, lab bookings and
          consultation status all return to their sample defaults. Nothing real is affected.
        </motion.p>
      </Modal>

      <p className={cn('text-center text-[11px] text-slate-400')}>
        CareLink prototype · version 1.0.0 · sample data only
      </p>
    </div>
  )
}
