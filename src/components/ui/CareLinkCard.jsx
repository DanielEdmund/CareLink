import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

const tones = {
  default: 'cl-card',
  soft: 'cl-card-soft',
  mint: 'cl-card-mint',
  plain: 'rounded-2xl border border-slate-200/80 bg-white/60',
}

/**
 * CareLinkCard — the base surface used everywhere.
 * Animates in gently when scrolled into view (disabled under reduced motion).
 */
export default function CareLinkCard({
  as: Tag = 'div',
  tone = 'default',
  hover = false,
  animate = true,
  delay = 0,
  padded = false,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    tones[tone],
    hover && 'cl-card-hover cursor-pointer',
    padded && 'p-4 sm:p-5',
    className
  )

  if (!animate) {
    return (
      <Tag className={classes} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={delay}
      className={classes}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
