import { motion } from 'framer-motion'
import { marketplace } from '../data/homeData'
import SectionHeader from './SectionHeader'
import { useState } from 'react'

function MarketplaceSection() {
  const handleMarketplaceClick = (title, price) => {
    alert(`🛒 Viewing "${title}" (${price})...`)
  }

  return (
    <section className="px-3 pt-6 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Village Marketplace" subtitle="Buy and sell near you" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {marketplace.map((item, index) => (
            <motion.button
              key={item.title}
              onClick={() => handleMarketplaceClick(item.title, item.price)}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="text-left rounded-card border border-slate-200 bg-white p-5 sm:p-4 shadow-soft hover:shadow-md transition cursor-pointer active:shadow-sm"
            >
              <p className="inline-flex rounded-full bg-agri-50 px-3 py-1.5 text-[10px] font-extrabold uppercase text-agri-700">
                {item.tag}
              </p>
              <h3 className="mt-3 text-base sm:text-sm font-extrabold leading-tight text-navy-900">{item.title}</h3>
              <p className="mt-2 text-2xl sm:text-lg font-black text-saffron-600">{item.price}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.place}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketplaceSection
