import { useId, useState } from 'react'
import { cn, getInitials } from '@/lib/utils'

/**
 * SmartImage — Unsplash photography with a graceful custom-SVG fallback so the
 * prototype never shows a broken image, even offline.
 */
export default function SmartImage({
  src,
  alt = '',
  className,
  imgClassName = 'h-full w-full object-cover',
  initials,
  rounded = 'rounded-2xl',
  tone = 'sky',
}) {
  const [failed, setFailed] = useState(false)
  const gradientId = `cl-img-${useId().replace(/:/g, '')}`
  const tones = {
    sky: ['#E8F3FF', '#155EEF'],
    mint: ['#E7F8F3', '#0E9F9A'],
    neutral: ['#F2F4F7', '#475467'],
  }
  const [bg, fg] = tones[tone] || tones.sky

  if (!src || failed) {
    return (
      <div
        className={cn('relative overflow-hidden grid place-items-center', rounded, className)}
        style={{ background: bg }}
        role="img"
        aria-label={alt || 'Placeholder illustration'}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={bg} />
              <stop offset="100%" stopColor={fg} stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <rect width="120" height="120" fill={`url(#${gradientId})`} />
          <circle cx="60" cy="46" r="20" fill={fg} opacity="0.18" />
          <path
            d="M24 104c4-20 18-30 36-30s32 10 36 30"
            fill={fg}
            opacity="0.18"
          />
          <path
            d="M60 52v18M51 61h18"
            stroke={fg}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
        {initials && (
          <span className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2 py-0.5 text-xs font-bold text-brand-navy">
            {initials}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', rounded, className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={imgClassName}
      />
    </div>
  )
}

/** Circular avatar built on SmartImage. */
export function Avatar({ src, name = '', size = 'md', className, tone = 'sky' }) {
  const sizes = { xs: 'h-8 w-8 text-[10px]', sm: 'h-10 w-10 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-base', xl: 'h-24 w-24 text-xl' }
  return (
    <SmartImage
      src={src}
      alt={name ? `${name} (sample photo)` : 'Sample photo'}
      initials={getInitials(name)}
      tone={tone}
      rounded="rounded-full"
      className={cn('shrink-0', sizes[size], className)}
      imgClassName="h-full w-full object-cover"
    />
  )
}
