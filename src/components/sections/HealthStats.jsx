import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import { motion } from 'framer-motion'
import StatCard from '@/components/ui/StatCard'
import SectionHeading from '@/components/ui/SectionHeading'
import SafetyNotice from '@/components/ui/SafetyNotice'
import { healthStats, vitalsTrend, wellnessBalance } from '@/data/mockData'
import { fadeUp, viewportOnce } from '@/lib/motion'

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E7EC',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#101828',
  boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
}

/** Sample vitals — stat tiles plus two genuinely useful charts. */
export default function HealthStats() {
  return (
    <section aria-labelledby="health-stats-heading">
      <SectionHeading
        id="health-stats-heading"
        eyebrow="Sample insights"
        title="Health snapshot"
        subtitle="Illustrative readings created for this prototype. They are not measurements of any real person."
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {healthStats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} delay={i} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="cl-card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-brand-navy">7-day sample blood pressure</h3>
              <p className="mt-0.5 text-[13px] text-brand-slate">
                Simulated trend line — not a real medical reading.
              </p>
            </div>
            <span className="cl-badge cl-badge-info">Mock data</span>
          </div>

          <div className="mt-4 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalsTrend} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="sysGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#155EEF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#155EEF" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E9F9A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0E9F9A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475467' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#475467' }} axisLine={false} tickLine={false} domain={[60, 140]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic (sample)"
                  stroke="#155EEF"
                  strokeWidth={2.5}
                  fill="url(#sysGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic (sample)"
                  stroke="#0E9F9A"
                  strokeWidth={2.5}
                  fill="url(#diaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="cl-card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Wellness balance</h3>
              <p className="mt-0.5 text-[13px] text-brand-slate">Simulated daily scores (0–100).</p>
            </div>
            <span className="cl-badge cl-badge-aqua">Sample</span>
          </div>

          <div className="mt-2 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={wellnessBalance}
                innerRadius="35%"
                outerRadius="95%"
                startAngle={90}
                endAngle={-270}
                barSize={14}
              >
                <RadialBar dataKey="value" background cornerRadius={8} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                  formatter={(value) => <span style={{ color: '#475467', fontWeight: 600 }}>{value}</span>}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <SafetyNotice className="mt-4" title="Not medical advice">
        This is sample information for demonstration purposes. CareLink does not monitor, diagnose or
        advise on health — discuss anything real with a qualified healthcare professional.
      </SafetyNotice>
    </section>
  )
}
