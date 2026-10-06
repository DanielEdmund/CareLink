/**
 * CareLink shared helpers (frontend prototype utilities only).
 */

/** Tiny class-name joiner (clsx-lite). */
export function cn(...parts) {
  return parts.flat(Infinity).filter(Boolean).join(' ')
}

/** Artificial delay used by the mock health service. */
export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

/** Randomised delay inside a range, for "realistic" mock latency. */
export const jitterDelay = (min = 300, max = 800) => delay(Math.round(min + Math.random() * (max - min)))

const NairaFmt = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

/** Format a demo price in Naira. Always label as demo at the call site. */
export function formatNaira(amount) {
  return NairaFmt.format(Number(amount) || 0)
}

/** Short, stable date formatting (e.g. "Mon, 12 Jun"). */
export function formatDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', opts)
}

/** Time formatting (e.g. "10:30 AM"). */
export function formatTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/** Full date-time string. */
export function formatDateTime(iso) {
  return `${formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long' })} · ${formatTime(iso)}`
}

/** Initials for avatars (handles "Dr. Chiamaka Eze" → "CE"). */
export function getInitials(name = '') {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

/** Human relative label: "in 2 days", "3 hours ago". */
export function relativeFromNow(iso) {
  const target = new Date(iso).getTime()
  if (Number.isNaN(target)) return ''
  const diff = target - Date.now()
  const abs = Math.abs(diff)
  const mins = Math.round(abs / 60000)
  const hours = Math.round(abs / 3600000)
  const days = Math.round(abs / 86400000)
  let unit
  if (mins < 60) unit = `${mins} minute${mins === 1 ? '' : 's'}`
  else if (hours < 24) unit = `${hours} hour${hours === 1 ? '' : 's'}`
  else unit = `${days} day${days === 1 ? '' : 's'}`
  return diff >= 0 ? `in ${unit}` : `${unit} ago`
}

/** Clamp helper. */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Demo confirmation codes — never imply a real transaction. */
export function demoCode(prefix = 'CL-DEMO') {
  const token = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${prefix}-${token}`
}

/** Reduced-motion preference detector. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
