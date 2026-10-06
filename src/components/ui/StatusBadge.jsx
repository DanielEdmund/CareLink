import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  Info,
  FlaskConical,
  Video,
  MapPin,
  CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Status map — status is ALWAYS communicated by icon + text, never colour alone.
 */
export const STATUS_MAP = {
  confirmed: { label: 'Confirmed', tone: 'info', icon: CircleDot },
  pending: { label: 'Pending', tone: 'warning', icon: Clock3 },
  completed: { label: 'Completed', tone: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', tone: 'neutral', icon: XCircle },
  ready: { label: 'Result ready', tone: 'success', icon: FlaskConical },
  processing: { label: 'Processing sample', tone: 'warning', icon: Clock3 },
  'needs-review': { label: 'Needs review', tone: 'warning', icon: AlertTriangle },
  reviewed: { label: 'Reviewed (demo)', tone: 'success', icon: CheckCircle2 },
  scheduled: { label: 'Scheduled', tone: 'info', icon: Clock3 },
  collected: { label: 'Collected (demo)', tone: 'neutral', icon: CheckCircle2 },
  expiring: { label: 'Expiring soon', tone: 'warning', icon: AlertTriangle },
  video: { label: 'Video consult', tone: 'aqua', icon: Video },
  'in person': { label: 'In person', tone: 'info', icon: MapPin },
  confirmedDemo: { label: 'Demo confirmed', tone: 'success', icon: CheckCircle2 },
}

const toneClass = {
  success: 'cl-badge-success',
  warning: 'cl-badge-warning',
  emergency: 'cl-badge-emergency',
  info: 'cl-badge-info',
  neutral: 'cl-badge-neutral',
  aqua: 'cl-badge-aqua',
}

/**
 * StatusBadge — pairs an icon and a text label with every status tone.
 */
export default function StatusBadge({ status = 'pending', label, tone, icon: Icon, className, ...rest }) {
  const meta = STATUS_MAP[status] || STATUS_MAP.pending
  const ResolvedIcon = Icon || meta.icon
  const text = label || meta.label
  const toneClassname = toneClass[tone || meta.tone] || toneClass.neutral

  return (
    <span className={cn('cl-badge', toneClassname, className)} {...rest}>
      <ResolvedIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </span>
  )
}

/** Small "demo content" tag used across the prototype. */
export function DemoTag({ children = 'Demo', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-[#FFF7E8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#B54708] border border-[#FEDF89]',
        className
      )}
    >
      {children}
    </span>
  )
}
