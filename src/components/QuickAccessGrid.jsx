import { motion } from 'framer-motion'
import {
  Newspaper,
  Wheat,
  CloudSun,
  LineChart,
  Siren,
  Landmark,
  Store,
  Clapperboard
} from 'lucide-react'
import SectionHeader from './SectionHeader'
import { quickAccess } from '../data/homeData'

const iconMap = {
  Newspaper,
  Wheat,
  CloudSun,
  LineChart,
  Siren,
  Landmark,
  Store,
  Clapperboard
}

function QuickAccessGrid() {
  const handleQuickAccess = (title) => {
    const messages = {
      'Live News': '📰 Opening live news feed...',
      'Mandi Rates': '💰 Loading mandi rates...',
      'Weather': '🌤️ Checking weather conditions...',
      'Statistics': '📊 Showing village statistics...',
      'Report Alert': '⚠️ Opening alert report form...',
      'Government': '🏛️ Government schemes portal...',
      'Marketplace': '🛒 Loading marketplace...',
      'Videos': '🎬 Opening video gallery...'
    }
    alert(messages[title] || `Opening ${title}...`)
  }

  return (
    <section className="px-3 pt-5 sm:px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Quick Access" subtitle="Tap and report faster" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {quickAccess.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.03, duration: 0.35 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAccess(item.title)}
                className="group rounded-card border border-slate-200 bg-white p-5 sm:p-4 text-left shadow-soft transition hover:-translate-y-1 active:scale-[0.96]"
              >
                <div className="mb-4 inline-flex h-14 w-14 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-agri-50 text-agri-700 group-hover:bg-agri-100">
                  <Icon size={22} />
                </div>
                <p className="text-base sm:text-sm font-extrabold text-navy-900">{item.title}</p>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default QuickAccessGrid
