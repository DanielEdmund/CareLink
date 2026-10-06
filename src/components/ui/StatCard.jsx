import { motion } from 'framer-motion'
import { Heart, Activity, Scale, Footprints, Moon, Droplet, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

const icons = { heart: Heart, activity: Activity, scale: Scale, footprints: Footprints, moon: Moon, droplet: Droplet }
const trendMeta = {
  up: { icon: TrendingUp, label: 'Trending up' },
  down: { icon: TrendingDown, label: 'Trending down' },
  steady: { icon: Minus, label: 'Steady' },
  good: { icon: Activity, label: 'In sample range' },
}

/**
 * StatCard — a compact sample-metric tile.
 * The sample nature of every value is always stated in text.
 */
export default function StatCard({ stat, delay = 0, className }) {
  const Icon = icons[stat.icon] || Activity
  const trend = trendMeta[stat.trend] || trendMeta.steady
  const TrendIcon = trend.icon

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={delay}
      className={cn('cl-stat group', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-blue-soft text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-brand-slate"
          title={trend.label}
        >
          <TrendIcon className="h-3 w-3" aria-hidden="true" />
          {trend.label}
        </span>
      </div>

      <div>
        <p className="cl-stat-value">
          {stat.value}
          <span className="ml-1.5 text-sm font-semibold text-brand-slate">{stat.unit}</span>
        </p>
        <p className="cl-stat-label mt-0.5">{stat.label}</p>
      </div>

      <p className="text-[11px] font-medium text-slate-400">{stat.note} · not medical advice</p>
    </motion.article>
  )
}
