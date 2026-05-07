import { motion } from 'framer-motion'
import { PenLine, Camera, MapPin, BadgeCheck, LineChart } from 'lucide-react'
import { footerActions } from '../data/homeData'

const ICON_MAP = {
  PenLine,
  Camera,
  MapPin,
  BadgeCheck,
  LineChart,
}

const ACTION_MESSAGES = {
  'PenLine': '✍️ Opening report submission form...',
  'Camera': '📸 Opening photo upload gallery...',
  'MapPin': '🗺️ Loading village explorer map...',
  'BadgeCheck': '✓ Opening verification portal...',
  'LineChart': '📊 Opening analytics dashboard...'
}

function CommunityReportCTA() {
  const handleActionClick = (action, title) => {
    const msg = ACTION_MESSAGES[action.icon] || `Opening ${title}...`
    alert(msg)
  }

  return (
    <section className="px-3 pt-6 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl overflow-hidden rounded-[12px] bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          {footerActions.map((a, idx) => {
            const Icon = ICON_MAP[a.icon] || PenLine
            return (
              <motion.button
                key={a.title}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(a, a.title)}
                type="button"
                className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 text-left hover:shadow-md transition"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.subtitle}</div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default CommunityReportCTA
