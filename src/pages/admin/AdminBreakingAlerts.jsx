const alerts = [
  { id: 'BA-01', region: 'Rajepur Belt', title: 'Canal overflow warning in low-lying roads', status: 'Live', reach: '43k' },
  { id: 'BA-02', region: 'Kaimganj Core', title: 'Traffic diversion near mandi junction', status: 'Scheduled', reach: '21k' },
  { id: 'BA-03', region: 'Shamsabad East', title: 'Power restoration update', status: 'Draft', reach: '34k' },
]

export default function AdminBreakingAlerts() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Breaking Alerts</h2>
        <p className="mt-1 text-sm text-slate-500">Manage live ticker alerts and district emergency notices.</p>
      </header>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{alert.id} • {alert.region}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{alert.title}</h3>
              </div>
              <span className="rounded-full bg-[#0f6a2f] px-3 py-1 text-xs font-semibold text-white">{alert.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Estimated reach: {alert.reach}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
