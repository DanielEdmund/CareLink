import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

/**
 * Consistent section heading: eyebrow → title → supporting copy → actions.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = 'left',
  className,
  id,
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'text-center')}>
        {eyebrow && <p className="cl-eyebrow">{eyebrow}</p>}
        <h2 id={id} className="cl-section-title mt-1.5">
          {title}
        </h2>
        {subtitle && <p className="cl-section-sub">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
