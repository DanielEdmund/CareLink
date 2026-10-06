import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * CareLink identity mark — custom SVG.
 * The pulse line inside a "connected" link reads as health + connection.
 */
export function LogoMark({ size = 36, className }) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `cl-mark-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#155EEF" />
          <stop offset="1" stopColor="#0E9F9A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M8 21.5h6.4l2.7-6.2 4.1 11.2 3-5h7.8"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30.5" cy="12.5" r="3.2" fill="#E7F8F3" />
      <path
        d="M28.4 12.5h4.2M30.5 10.4v4.2"
        stroke="#0E9F9A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logo({ size = 36, light = false, tagline = true, className }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-display text-lg font-extrabold tracking-tight',
            light ? 'text-white' : 'text-brand-navy'
          )}
        >
          Care<span className="text-brand-aqua">Link</span>
        </span>
        {tagline && (
          <span
            className={cn(
              'text-[10px] font-semibold tracking-wide',
              light ? 'text-white/70' : 'text-brand-slate'
            )}
          >
            Healthcare, Connected Around You
          </span>
        )}
      </span>
    </span>
  )
}
