import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { mandiRates } from '../data/homeData'
import { useState } from 'react'

function MandiRatesSection() {
  const handleMandiRate = (item, rate) => {
    alert(`💰 ${item} is trading at ${rate}`)
  }

  return (
    <section className="px-3 pt-6 sm:px-4 md:px-6">
      <div className="mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeader title="Live Mandi Rates" subtitle="Swipe latest prices" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {mandiRates.map((item, index) => (
            <motion.button
              key={item.item}
              onClick={() => handleMandiRate(item.item, item.rate)}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.32, delay: index * 0.04 }}
              className="text-left min-w-[200px] sm:min-w-[220px] rounded-[24px] border border-slate-200 bg-white p-5 sm:p-4 shadow-soft hover:shadow-md transition cursor-pointer active:shadow-sm"
            >
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{item.item}</p>
              <p className="mt-1 text-2xl font-black text-navy-900">{item.rate}</p>
              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {item.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {item.trend}
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">{item.market}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white py-2">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="flex min-w-max gap-10 px-3 text-sm font-bold text-slate-600"
          >
            {Array.from({ length: 2 }).map((_, idx) =>
              mandiRates.map((item) => (
                <p key={`${idx}-${item.item}`}>
                  {item.item}: {item.rate}
                </p>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MandiRatesSection
