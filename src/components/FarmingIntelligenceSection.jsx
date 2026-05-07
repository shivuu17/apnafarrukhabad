import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { farmingIntel } from '../data/homeData'
import { useState } from 'react'

function FarmingIntelligenceSection() {
  const handleFarmingTip = (title, value) => {
    alert(`🌾 ${title}: ${value}`)
  }

  return (
    <section className="px-3 pt-6 sm:px-4">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
        <SectionHeader title="Farming Intelligence" subtitle="Actionable field updates" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {farmingIntel.map((item, index) => (
            <motion.button
              key={item.title}
              onClick={() => handleFarmingTip(item.title, item.value)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="text-left rounded-card border border-emerald-200 bg-gradient-to-br from-white to-agri-50/50 p-5 sm:p-4 shadow-soft hover:shadow-md transition cursor-pointer active:shadow-sm"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">{item.title}</p>
              <p className="mt-2 text-lg sm:text-base font-black text-navy-900">{item.value}</p>
              <p className="mt-2 text-xs font-medium text-slate-600">{item.note}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FarmingIntelligenceSection
