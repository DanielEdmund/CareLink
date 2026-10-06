import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pencil,
  Save,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Users,
  Siren,
  BadgeCheck,
} from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import CareLinkCard from '@/components/ui/CareLinkCard'
import CareLinkButton from '@/components/ui/CareLinkButton'
import SmartImage, { Avatar } from '@/components/ui/SmartImage'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { DemoTag } from '@/components/ui/StatusBadge'
import { FormField, TextInput } from '@/components/ui/FormField'
import { demoUser, demoFamilyMembers, doctors } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'

/** Sample patient profile with locally-editable demo details. */
export default function Profile() {
  const { pushToast, preferences } = useCareLink()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: demoUser.name,
    phone: demoUser.phone,
    email: demoUser.email,
    address: demoUser.address,
    emergencyName: demoUser.emergencyContact.name,
    emergencyPhone: demoUser.emergencyContact.phone,
  })

  function saveProfile(e) {
    e.preventDefault()
    setEditing(false)
    pushToast({
      tone: 'success',
      title: 'Demo profile updated',
      message: 'Changes are held in local state for this session only — nothing was saved to a server.',
    })
  }

  const details = [
    { label: 'Age', value: `${demoUser.age} years (sample)` },
    { label: 'Gender', value: `${demoUser.gender} (sample)` },
    { label: 'Blood type', value: demoUser.bloodType },
    { label: 'Genotype', value: demoUser.genotype },
    { label: 'Height', value: demoUser.height },
    { label: 'Weight', value: demoUser.weight },
  ]

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample account"
        title="My profile"
        subtitle="A fictional patient profile used to demonstrate the interface. Edits stay in local state."
        action={
          <CareLinkButton
            variant={editing ? 'primary' : 'secondary'}
            icon={editing ? Save : Pencil}
            onClick={() => (editing ? document.getElementById('profile-form')?.requestSubmit() : setEditing(true))}
          >
            {editing ? 'Save demo changes' : 'Edit profile'}
          </CareLinkButton>
        }
      />

      {/* Identity */}
      <CareLinkCard animate={false} className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-brand-blue to-brand-aqua">
          <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="#FFFFFF" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="px-4 pb-5 sm:px-6">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <div className="rounded-full border-4 border-white">
              <Avatar src={demoUser.avatar} name={demoUser.name} size="xl" />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-brand-navy">{form.name}</h2>
                <DemoTag>Sample account</DemoTag>
              </div>
              <p className="text-sm text-brand-slate">
                {demoUser.occupation} · {demoUser.city}, Nigeria
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-mint px-3 py-1.5 text-[12px] font-bold text-[#08615E]">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Demo profile verified
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">{d.label}</dt>
                <dd className="mt-1 text-sm font-bold text-brand-navy">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CareLinkCard>

      <div className="grid gap-5 grid-cols-1 min-w-0 items-start lg:grid-cols-2">
        {/* Editable details */}
        <CareLinkCard animate={false} padded className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy">Contact details</h3>
            <span className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">
              {editing ? 'Editing' : 'Read only'}
            </span>
          </div>

          <form id="profile-form" onSubmit={saveProfile} className="space-y-4">
            <FormField label="Full name">
              {({ id }) => (
                <TextInput
                  id={id}
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              )}
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone">
                {({ id }) => (
                  <TextInput
                    id={id}
                    type="tel"
                    value={form.phone}
                    disabled={!editing}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                )}
              </FormField>
              <FormField label="Email">
                {({ id }) => (
                  <TextInput
                    id={id}
                    type="email"
                    value={form.email}
                    disabled={!editing}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                )}
              </FormField>
            </div>

            <FormField label="Address">
              {({ id }) => (
                <TextInput
                  id={id}
                  value={form.address}
                  disabled={!editing}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              )}
            </FormField>

            <fieldset className="rounded-2xl border border-slate-200 p-3.5" disabled={!editing}>
              <legend className="px-1 text-[12px] font-bold uppercase tracking-wide text-brand-slate">
                Emergency contact (sample)
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      value={form.emergencyName}
                      onChange={(e) => setForm((f) => ({ ...f, emergencyName: e.target.value }))}
                    />
                  )}
                </FormField>
                <FormField label="Phone">
                  {({ id }) => (
                    <TextInput
                      id={id}
                      type="tel"
                      value={form.emergencyPhone}
                      onChange={(e) => setForm((f) => ({ ...f, emergencyPhone: e.target.value }))}
                    />
                  )}
                </FormField>
              </div>
            </fieldset>

            {editing && (
              <div className="flex gap-2">
                <CareLinkButton type="submit" icon={Save}>
                  Save demo changes
                </CareLinkButton>
                <CareLinkButton
                  variant="ghost"
                  onClick={() => {
                    setEditing(false)
                    setForm({
                      name: demoUser.name,
                      phone: demoUser.phone,
                      email: demoUser.email,
                      address: demoUser.address,
                      emergencyName: demoUser.emergencyContact.name,
                      emergencyPhone: demoUser.emergencyContact.phone,
                    })
                  }}
                >
                  Cancel
                </CareLinkButton>
              </div>
            )}
          </form>
        </CareLinkCard>

        {/* Care info */}
        <div className="space-y-5 min-w-0">
          <CareLinkCard animate={false} padded>
            <h3 className="text-base font-bold text-brand-navy">Care & coverage (sample)</h3>

            <div className="mt-3 space-y-3">
              <div className="cl-card-soft p-3.5">
                <p className="flex items-center gap-2 text-[13px] font-bold text-brand-navy">
                  <ShieldCheck className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  {demoUser.insurance.provider}
                </p>
                <p className="mt-1 text-[13px] text-brand-slate">
                  Policy {demoUser.insurance.number} · {demoUser.insurance.plan}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-status-warning">
                  Sample coverage — not a real insurance policy
                </p>
              </div>

              <div className="rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] p-3.5">
                <p className="flex items-center gap-2 text-[13px] font-bold text-[#B42318]">
                  <Siren className="h-4 w-4" aria-hidden="true" /> Recorded allergies (sample)
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {demoUser.allergies.map((a) => (
                    <li key={a} className="rounded-lg bg-white px-2.5 py-1 text-[12px] font-semibold text-[#B42318]">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="flex items-center gap-2 text-[13px] font-bold text-brand-navy">
                  <HeartPulse className="h-4 w-4 text-brand-aqua" aria-hidden="true" /> Care team (sample)
                </p>
                <ul className="mt-2 space-y-2">
                  {demoUser.careTeam.map((name) => {
                    const doc = doctors.find((d) => d.name === name)
                    return (
                      <li key={name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                        <SmartImage
                          src={doc?.image}
                          alt={name}
                          initials="DR"
                          rounded="rounded-lg"
                          className="h-10 w-10"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold text-brand-navy">{name}</p>
                          <p className="truncate text-[12px] text-brand-slate">{doc?.specialty}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </CareLinkCard>

          <CareLinkCard animate={false} padded>
            <h3 className="flex items-center gap-2 text-base font-bold text-brand-navy">
              <Users className="h-4 w-4 text-brand-blue" aria-hidden="true" /> Family profiles (sample)
            </h3>
            <ul className="mt-3 space-y-2">
              {demoFamilyMembers.map((member) => (
                <li key={member.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-brand-navy">{member.name}</p>
                    <p className="truncate text-[12px] text-brand-slate">
                      {member.relation} · {member.age} years · {member.note}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-brand-slate">
                    Demo
                  </span>
                </li>
              ))}
            </ul>
            <p className="cl-help mt-3">
              Family profiles are fictional. CareLink does not manage dependants or real identities.
            </p>
          </CareLinkCard>
        </div>
      </div>

      <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
        <SafetyNotice title="Sample profile only">
          Everything on this page is fictional demonstration content. No real patient information is
          stored, and no healthcare provider receives it.
        </SafetyNotice>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <Link to="/settings" className="cl-btn cl-btn-secondary">
          Open settings
        </Link>
        <Link to="/dashboard" className="cl-btn cl-btn-ghost">
          Back to dashboard
        </Link>
        <span className="ml-auto inline-flex flex-wrap items-center gap-x-3 gap-y-1 self-center text-[12px] font-semibold text-brand-slate">
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {form.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {form.email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {demoUser.state}
          </span>
        </span>
        <span className="sr-only">{preferences.language}</span>
      </div>
    </div>
  )
}
