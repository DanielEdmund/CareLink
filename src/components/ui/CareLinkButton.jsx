import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const base = 'cl-btn'
const variants = {
  primary: 'cl-btn-primary',
  secondary: 'cl-btn-secondary',
  aqua: 'cl-btn-aqua',
  ghost: 'cl-btn-ghost',
  soft: 'cl-btn-soft',
  danger: 'cl-btn-danger',
}
const sizes = {
  sm: 'cl-btn-sm',
  md: '',
  lg: 'cl-btn-lg',
}

/**
 * The CareLink button. Minimum 48px touch target (md/lg), visible focus ring.
 */
const CareLinkButton = forwardRef(function CareLinkButton(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon: Icon = null,
    iconRight: IconRight = null,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref
) {
  const isNative = Tag === 'button'
  return (
    <Tag
      ref={ref}
      type={isNative ? type : undefined}
      disabled={isNative ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
      <span>{loading && loadingText ? loadingText : children}</span>
      {!loading && IconRight && <IconRight className="h-[18px] w-[18px]" aria-hidden="true" />}
    </Tag>
  )
})

export default CareLinkButton
