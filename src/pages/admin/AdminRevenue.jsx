const channels = [
  { name: 'Homepage Banner', revenue: 'Rs 78,400', growth: '+8.2%' },
  { name: 'Sponsored Story', revenue: 'Rs 52,100', growth: '+5.9%' },
  { name: 'Video Pre-roll', revenue: 'Rs 39,500', growth: '+11.4%' },
]

export default function AdminRevenue() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Revenue</h2>
        <p className="mt-1 text-sm text-slate-500">Ad and sponsored channel performance snapshot.</p>
      </header>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {channels.map((channel) => (
            <article key={channel.name} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-[#f7fbf8] p-3">
              <div>
                <p className="font-semibold text-slate-800">{channel.name}</p>
                <p className="text-sm text-slate-500">{channel.revenue}</p>
              </div>
              <span className="text-sm font-bold text-[#0f6a2f]">{channel.growth}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
