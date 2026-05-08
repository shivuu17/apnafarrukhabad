const reports = [
  { id: 'R-201', type: 'Fake News', age: '12m', priority: 'High' },
  { id: 'R-188', type: 'Abusive Content', age: '31m', priority: 'Medium' },
  { id: 'R-173', type: 'Duplicate Story', age: '1h', priority: 'Low' },
]

export default function AdminReports() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Reports</h2>
        <p className="mt-1 text-sm text-slate-500">Incoming complaint queue with priority handling.</p>
      </header>

      <div className="grid gap-3">
        {reports.map((report) => (
          <article key={report.id} className="rounded-[22px] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{report.id}</p>
                <h3 className="mt-1 text-base font-bold text-slate-900">{report.type}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{report.age}</span>
                <span className="rounded-full bg-[#0f6a2f] px-2.5 py-1 text-xs font-semibold text-white">{report.priority}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
