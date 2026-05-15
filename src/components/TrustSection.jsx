import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { trustStats } from '../data/homeData'
import { getModerationState, subscribeToModerationChanges } from '../services/mediaModeration.service'

function TrustSection() {
  const [counts, setCounts] = useState({ total: 0, approved: 0, pending: 0 })

  useEffect(() => {
    let mounted = true

    const loadCounts = async () => {
      try {
        const state = await getModerationState()
        if (!mounted) return
        const approved = state.approved?.length || 0
        const pending = state.pending?.length || 0
        setCounts({ total: approved + pending, approved, pending })
      } catch {
        if (mounted) setCounts({ total: 0, approved: 0, pending: 0 })
      }
    }

    loadCounts()

    const unsubscribe = subscribeToModerationChanges((state) => {
      setCounts({
        total: (state.approved?.length || 0) + (state.pending?.length || 0),
        approved: state.approved?.length || 0,
        pending: state.pending?.length || 0,
      })
    })

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  if (!trustStats.length) {
    return (
      <section className="px-3 pt-6 sm:px-4">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl rounded-card border border-slate-200 bg-white p-5 shadow-soft">
          <SectionHeader title="Community Trust" subtitle="Live moderation status" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total reports</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{counts.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
              <p className="mt-2 text-2xl font-black text-emerald-800">{counts.approved}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
              <p className="mt-2 text-2xl font-black text-amber-800">{counts.pending}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
