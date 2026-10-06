import { ShieldAlert, ShieldCheck, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = {
  warning: { cls: 'bg-[#FFFAEB] border-[#FEDF89] text-[#7A2E0E]', icon: ShieldAlert },
  info: { cls: 'bg-brand-blue-soft border-[#C7DCFF] text-[#0B3B8C]', icon: Info },
  success: { cls: 'bg-brand-mint border-[#A9E7DC] text-[#08615E]', icon: ShieldCheck },
}

/**
 * The standard prototype-safety notice shown near healthcare content.
 */
export default function SafetyNotice({ tone = 'warning', title, children, className, icon: Icon }) {
  const meta = tones[tone] || tones.warning
  const ResolvedIcon = Icon || meta.icon
  return (
    <div
      role="note"
      className={cn('flex items-start gap-3 rounded-2xl border p-3.5 sm:p-4', meta.cls, className)}
    >
      <ResolvedIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-[13px] leading-relaxed">
        {title && <p className="mb-0.5 font-bold">{title}</p>}
        <p>
          {children ||
            'This is sample information for demonstration purposes and is not medical advice.'}
        </p>
      </div>
    </div>
  )
}

/** Compact inline "demo" strip. */
export function DemoStrip({ children = 'Prototype — sample data only' }) {
  return <span className="cl-demo-strip">{children}</span>
}
