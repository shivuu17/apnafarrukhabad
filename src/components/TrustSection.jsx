import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { trustStats } from '../data/homeData'

function TrustSection() {
  return (
    <section className="px-3 pt-6 sm:px-4">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
        <SectionHeader title="Community Trust" subtitle="Growing district network" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trustStats.map((item, index) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.32, delay: index * 0.04 }}
              className="rounded-card border border-slate-200 bg-white p-3 shadow-soft sm:p-4"
            >
              <p className="text-xl font-black text-navy-900 sm:text-2xl">{item.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{item.label}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
