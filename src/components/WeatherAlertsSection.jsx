import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { weatherCards } from '../data/homeData'
import { useState } from 'react'

function WeatherAlertsSection() {
  const handleWeatherAlert = (label, value) => {
    alert(`🌦️ ${label}: ${value}`)
  }

  return (
    <section className="px-3 pt-6 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Weather + Alerts" subtitle="Live district pulse" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {weatherCards.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => handleWeatherAlert(item.label, item.value)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="text-left rounded-card border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-4 shadow-soft hover:shadow-md transition cursor-pointer active:shadow-sm"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl sm:text-xl font-black text-navy-900">{item.value}</p>
              <p className="mt-2 text-xs font-medium text-slate-600">{item.note}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WeatherAlertsSection
