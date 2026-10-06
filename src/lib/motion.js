/**
 * Shared Framer Motion presets — deliberately restrained.
 * Motion here only ever confirms state: a short fade with a very small lift,
 * never travel, bounce or overshoot. Durations stay inside 120–300ms and
 * movement never exceeds 8px, so the interface reads as calm and professional.
 */
import { useReducedMotion } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: i * 0.04, ease: EASE },
  }),
  exit: { opacity: 0, transition: { duration: 0.16, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.22, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: EASE } },
}

/** Menus, popovers and dialogs — a small settle, not a bounce. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98, y: -4 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: EASE } },
  exit: { opacity: 0, scale: 0.99, transition: { duration: 0.12, ease: EASE } },
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
}

export const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
}

/** Route change — a plain crossfade with a 4px settle. */
export const pageVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.14, ease: EASE } },
}

/** Standard viewport config so off-screen cards animate once on entry. */
export const viewportOnce = { once: true, amount: 0.15 }

/** True when the OS or the user asked for reduced motion. */
export function useSafeMotion() {
  const systemReduced = useReducedMotion()
  const userReduced =
    typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion')
  return Boolean(systemReduced || userReduced)
}

/** Returns motion props that collapse to nothing when motion is reduced. */
export function useMotionProps(variants = fadeUp, custom) {
  const reduced = useSafeMotion()
  if (reduced) {
    return {
      initial: 'hidden',
      animate: 'show',
      exit: 'exit',
      variants: { hidden: { opacity: 1 }, show: { opacity: 1 }, exit: { opacity: 1 } },
      custom,
    }
  }
  return { variants, custom }
}
