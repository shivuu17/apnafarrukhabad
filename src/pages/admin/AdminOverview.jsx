import { useEffect, useState } from 'react'
import { getModerationState } from '../../services/mediaModeration.service'

export default function AdminOverview() {
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
        if (!mounted) return
        setCounts({ total: 0, approved: 0, pending: 0 })
      }
    }

    loadCounts()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="space-y-6">
      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-[#0f6a2f]">Live admin data</h3>
        <p className="mt-2 text-sm text-slate-500">
          Your moderation queue summary updates from the live report store.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total reports</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{counts.total}</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Reports done</p>
            <p className="mt-2 text-3xl font-black text-emerald-800">{counts.approved}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending review</p>
            <p className="mt-2 text-3xl font-black text-amber-800">{counts.pending}</p>
          </div>
        </div>
      </section>
    </section>
  )
}