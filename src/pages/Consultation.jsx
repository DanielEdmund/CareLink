import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Clock3,
  Send,
  ShieldAlert,
  DoorOpen,
  CheckCircle2,
} from 'lucide-react'

import SectionHeading from '@/components/ui/SectionHeading'
import CareLinkButton from '@/components/ui/CareLinkButton'
import SmartImage from '@/components/ui/SmartImage'
import StatusBadge, { DemoTag } from '@/components/ui/StatusBadge'
import SafetyNotice from '@/components/ui/SafetyNotice'
import EmptyState from '@/components/ui/EmptyState'

import { useCareLink } from '@/context/CareLinkContext'
import { doctors, consultationScript, DEMO_DISCLAIMER } from '@/data/mockData'
import { cn, formatTime, relativeFromNow } from '@/lib/utils'
import { fadeUp, EASE } from '@/lib/motion'

const pad = (n) => String(n).padStart(2, '0')

/** Simulated consultation room: waiting → in session → ended. */
export default function Consultation() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    appointments,
    consultation,
    joinConsultation,
    leaveConsultation,
    pending,
    pushToast,
  } = useCareLink()

  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [messages, setMessages] = useState(consultationScript)
  const [draft, setDraft] = useState('')
  const chatEndRef = useRef(null)

  const eligible = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'confirmed' || a.status === 'pending')
        .sort((a, b) => new Date(a.start) - new Date(b.start)),
    [appointments]
  )

  const activeAppointment =
    appointments.find((a) => a.id === consultation.appointmentId) || eligible[0]
  const doctor = doctors.find((d) => d.id === activeAppointment?.doctorId)

  // Arriving from the Appointments page with a pre-selected booking.
  useEffect(() => {
    const incoming = location.state?.appointmentId
    if (incoming && consultation.state === 'idle') {
      joinConsultation(incoming)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `msg_${Date.now()}`, from: 'patient', text, time: 'Just now' },
    ])
    setDraft('')

    // Scripted "doctor" reply — purely local demo behaviour.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}_d`,
          from: 'doctor',
          text: 'Thanks — this is an automated demo reply. In a real product a clinician would respond here.',
          time: 'Just now',
        },
      ])
    }, 900)
  }

  const state = consultation.state
  const mins = Math.floor(consultation.countdownSeconds / 60)
  const secs = consultation.countdownSeconds % 60

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Simulated visit"
        title="Consultation room"
        subtitle="A scripted waiting-room experience. No video call, clinician or medical advice is involved."
        action={<DemoTag>Simulated consultation</DemoTag>}
      />

      <SafetyNotice title="This is not a real consultation" icon={ShieldAlert}>
        CareLink is a frontend prototype. Nothing said, typed or shown here reaches a healthcare
        professional, and nothing here is medical advice.
      </SafetyNotice>

      <AnimatePresence mode="wait">
        {/* ---------------------------- IDLE ---------------------------- */}
        {state === 'idle' && (
          <motion.section
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="space-y-4"
          >
            {eligible.length === 0 ? (
              <EmptyState
                title="No demo appointment to join"
                body="Book a sample appointment first — the waiting room opens from your appointment list."
                icon={Video}
                cta={{ label: 'Go to appointments' }}
                action={() => navigate('/appointments')}
              />
            ) : (
              <>
                <h2 className="text-base font-bold text-brand-navy">Choose a demo appointment</h2>
                <ul className="grid gap-3 lg:grid-cols-2">
                  {eligible.map((apt) => {
                    const doc = doctors.find((d) => d.id === apt.doctorId)
                    return (
                      <li key={apt.id} className="cl-card flex min-w-0 flex-col gap-3 p-4">
                        <div className="flex items-start gap-3">
                          <SmartImage
                            src={doc?.image}
                            alt={doc ? `${doc.name} sample photo` : 'Sample photo'}
                            initials="DR"
                            rounded="rounded-xl"
                            className="h-12 w-12"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-brand-navy">{doc?.name}</p>
                              <StatusBadge status={apt.status} />
                            </div>
                            <p className="text-[13px] text-brand-slate">
                              {formatTime(apt.start)} · {relativeFromNow(apt.start)} · {apt.type}
                            </p>
                            <p className="text-[13px] font-medium text-brand-navy">{apt.reason}</p>
                          </div>
                        </div>
                        <CareLinkButton
                          variant="aqua"
                          icon={DoorOpen}
                          loading={pending.joinConsultation}
                          onClick={() => joinConsultation(apt.id)}
                        >
                          Enter waiting room
                        </CareLinkButton>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </motion.section>
        )}

        {/* ---------------------------- WAITING ---------------------------- */}
        {state === 'joining' && (
          <motion.div
            key="joining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cl-card grid min-h-[280px] place-items-center p-8 text-center"
          >
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-blue-soft">
                <Video className="h-7 w-7 text-brand-blue" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-brand-navy">Connecting to the mock room…</p>
              <p className="mt-1 text-[13px] text-brand-slate">Simulating a secure handshake (demo).</p>
            </div>
          </motion.div>
        )}

        {state === 'waiting' && (
          <motion.section
            key="waiting"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="cl-card overflow-hidden"
          >
            <div className="grid gap-0 lg:grid-cols-[1.2fr_.8fr]">
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="cl-badge cl-badge-aqua">
                    <span className="inline-block h-2 w-2 rounded-full bg-brand-aqua" />
                    Waiting room
                  </span>
                  <DemoTag>Simulated</DemoTag>
                </div>

                <h2 className="mt-3 text-xl font-bold text-brand-navy">Please wait, we are “connecting” you</h2>
                <p className="mt-1.5 text-sm text-brand-slate">
                  {doctor?.name} · {doctor?.specialty}. Your demo appointment starts{' '}
                  {activeAppointment ? relativeFromNow(activeAppointment.start) : 'shortly'}.
                </p>

                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-brand-blue-soft p-4">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-pill">
                    <Clock3 className="h-8 w-8 text-brand-blue" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">
                      Room opens in
                    </p>
                    <p className="font-display text-4xl font-extrabold tabular-nums text-brand-blue">
                      {pad(mins)}:{pad(secs)}
                    </p>
                    <p className="text-[11px] text-brand-slate">Simulated countdown</p>
                  </div>
                </div>

                {/* Demo device controls */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMicOn((v) => !v)}
                    aria-pressed={micOn}
                    className={cn(
                      'cl-btn cl-btn-sm',
                      micOn ? 'cl-btn-secondary' : 'bg-[#FEF3F2] text-status-emergency border border-[#FECDCA]'
                    )}
                  >
                    {micOn ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
                    {micOn ? 'Mic on (demo)' : 'Mic muted'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCamOn((v) => !v)}
                    aria-pressed={camOn}
                    className={cn(
                      'cl-btn cl-btn-sm',
                      camOn ? 'cl-btn-secondary' : 'bg-[#FEF3F2] text-status-emergency border border-[#FECDCA]'
                    )}
                  >
                    {camOn ? <Camera className="h-4 w-4" aria-hidden="true" /> : <CameraOff className="h-4 w-4" aria-hidden="true" />}
                    {camOn ? 'Camera on (demo)' : 'Camera off'}
                  </button>
                  <CareLinkButton variant="ghost" size="sm" icon={PhoneOff} onClick={leaveConsultation}>
                    Leave waiting room
                  </CareLinkButton>
                </div>

                <p className="mt-4 text-[12px] leading-relaxed text-brand-slate">
                  Camera and microphone toggles change interface state only — nothing is captured,
                  transmitted or recorded.
                </p>
              </div>

              <aside className="border-t border-slate-100 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">Your clinician</p>
                <div className="mt-3 flex items-center gap-3">
                  <SmartImage
                    src={doctor?.image}
                    alt={doctor ? `${doctor.name} sample photo` : 'Sample photo'}
                    initials="DR"
                    rounded="rounded-2xl"
                    className="h-16 w-16"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-navy">{doctor?.name}</p>
                    <p className="truncate text-[13px] text-brand-slate">{doctor?.specialty}</p>
                    <p className="truncate text-[12px] text-brand-slate">{doctor?.hospital}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-slate">Reference</dt>
                    <dd className="font-semibold text-brand-navy">{activeAppointment?.code}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-slate">Reason</dt>
                    <dd className="text-right font-semibold text-brand-navy">{activeAppointment?.reason}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-slate">Type</dt>
                    <dd className="font-semibold text-brand-navy">Simulated video</dd>
                  </div>
                </dl>
                <p className="cl-safety-note mt-4">
                  <span>{DEMO_DISCLAIMER}</span>
                </p>
              </aside>
            </div>
          </motion.section>
        )}

        {/* ---------------------------- IN SESSION ---------------------------- */}
        {state === 'in-session' && (
          <motion.section
            key="session"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"
          >
            {/* Mock stage */}
            <div className="cl-card overflow-hidden">
              <div className="relative grid min-h-[300px] place-items-center bg-gradient-to-br from-brand-navy via-[#0B3B7A] to-brand-aqua p-6 text-center sm:min-h-[360px]">
                {/* Soft pattern */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden="true">
                  <defs>
                    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path d="M28 0H0v28" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <div className="relative">
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="mx-auto block"
                  >
                    <SmartImage
                      src={doctor?.image}
                      alt={doctor ? `${doctor.name} sample photo` : 'Sample photo'}
                      initials="DR"
                      rounded="rounded-full"
                      className="mx-auto h-28 w-28 ring-4 ring-white/40"
                    />
                  </motion.span>
                  <p className="mt-4 text-lg font-bold text-white">{doctor?.name}</p>
                  <p className="text-sm text-white/75">{doctor?.specialty} · simulated video</p>
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-status-success" aria-hidden="true" />
                    Simulated connection · not a real call
                  </span>
                </div>
              </div>

              {/* Control bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMicOn((v) => !v)}
                    aria-pressed={micOn}
                    aria-label={micOn ? 'Mute demo microphone' : 'Unmute demo microphone'}
                    className={cn('grid h-12 w-12 place-items-center rounded-xl border transition', micOn ? 'border-slate-200 bg-white text-brand-navy hover:bg-slate-50' : 'border-[#FECDCA] bg-[#FEF3F2] text-status-emergency')}
                  >
                    {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCamOn((v) => !v)}
                    aria-pressed={camOn}
                    aria-label={camOn ? 'Turn off demo camera' : 'Turn on demo camera'}
                    className={cn('grid h-12 w-12 place-items-center rounded-xl border transition', camOn ? 'border-slate-200 bg-white text-brand-navy hover:bg-slate-50' : 'border-[#FECDCA] bg-[#FEF3F2] text-status-emergency')}
                  >
                    {camOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  </button>
                </div>

                <CareLinkButton variant="danger" icon={PhoneOff} onClick={leaveConsultation}>
                  End simulated session
                </CareLinkButton>
              </div>
            </div>

            {/* Scripted chat */}
            <div className="cl-card flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-brand-navy">Scripted chat</p>
                <DemoTag>Demo</DemoTag>
              </div>

              <ul className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: 360 }}>
                {messages.map((m) => (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={cn('flex', m.from === 'patient' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                        m.from === 'patient'
                          ? 'bg-brand-blue text-white rounded-br-md'
                          : 'bg-slate-100 text-brand-navy rounded-bl-md'
                      )}
                    >
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide opacity-70">
                        {m.from === 'patient' ? 'You (sample)' : `${doctor?.name} (scripted)`}
                      </p>
                      {m.text}
                    </div>
                  </motion.li>
                ))}
                <li ref={chatEndRef} />
              </ul>

              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a demo message…"
                  aria-label="Type a demo message"
                  className="cl-input min-h-[44px]"
                />
                <button
                  type="submit"
                  aria-label="Send demo message"
                  className="cl-btn cl-btn-primary cl-btn-sm px-3"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.section>
        )}

        {/* ---------------------------- ENDED ---------------------------- */}
        {state === 'ended' && (
          <motion.section
            key="ended"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="cl-card mx-auto max-w-xl p-6 text-center sm:p-8"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-mint">
              <CheckCircle2 className="h-9 w-9 text-status-success" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-brand-navy">Simulated session ended</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-slate">
              Nothing was recorded, transmitted or saved. In a real product this is where a summary
              note and follow-up options would appear.
            </p>

            <div className="mt-5 rounded-2xl border border-dashed border-brand-blue/40 bg-brand-blue-soft p-4 text-left text-[13px] leading-relaxed text-brand-navy">
              <strong>Prototype only:</strong> CareLink does not provide diagnosis, treatment or
              medical advice. Speak with a qualified healthcare professional about any real health
              concern.
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <CareLinkButton
                variant="primary"
                onClick={() => {
                  setMessages(consultationScript)
                  joinConsultation(activeAppointment?.id)
                }}
              >
                Rejoin demo room
              </CareLinkButton>
              <CareLinkButton variant="secondary" onClick={() => navigate('/appointments')}>
                Back to appointments
              </CareLinkButton>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
