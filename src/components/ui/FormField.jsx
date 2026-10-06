import { useId } from 'react'
import { cn } from '@/lib/utils'

/** Label + control + helper text, wired together for screen readers. */
export function FormField({ label, hint, error, children, className, required }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="cl-label">
        {label}
        {required && <span className="ml-1 text-status-emergency" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {typeof children === 'function' ? children({ id }) : children}
      {hint && !error && <p className="cl-help">{hint}</p>}
      {error && (
        <p className="cl-help text-status-emergency font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** Text/number/date input using the shared .cl-input style. */
export function TextInput({ className, ...rest }) {
  return <input className={cn('cl-input', className)} {...rest} />
}

/** Native select styled to match the system. */
export function SelectInput({ className, children, ...rest }) {
  return (
    <div className="relative">
      <select className={cn('cl-input appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-slate"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Textarea using the shared input style. */
export function TextArea({ className, ...rest }) {
  return <textarea className={cn('cl-input min-h-[96px] py-3', className)} {...rest} />
}

/**
 * Switch — accessible toggle. State is described in text, not colour alone.
 */
export function Toggle({ checked, onChange, label, description, id }) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <label htmlFor={inputId} className="cursor-pointer text-sm font-semibold text-brand-navy">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-brand-slate">{description}</p>}
      </div>
      <button
        type="button"
        id={inputId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
          checked ? 'bg-brand-blue' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
            checked ? 'left-6' : 'left-1'
          )}
        />
      </button>
      <span className="sr-only">{checked ? 'On' : 'Off'}</span>
    </div>
  )
}
