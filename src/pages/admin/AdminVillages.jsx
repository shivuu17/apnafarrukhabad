const villages = [
  { name: 'Kaimganj', reporters: 44, posts: 216, health: 'Strong' },
  { name: 'Rajepur', reporters: 31, posts: 184, health: 'Stable' },
  { name: 'Shamsabad', reporters: 29, posts: 152, health: 'Needs Attention' },
]

export default function AdminVillages() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Villages</h2>
        <p className="mt-1 text-sm text-slate-500">Coverage and activity summary by village zones.</p>
      </header>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2">Village</th>
                <th className="px-3 py-2">Active Reporters</th>
                <th className="px-3 py-2">Published Posts</th>
                <th className="px-3 py-2">Coverage Health</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((village) => (
                <tr key={village.name} className="border-t border-emerald-100/90">
                  <td className="px-3 py-3 font-semibold text-slate-800">{village.name}</td>
                  <td className="px-3 py-3 text-slate-600">{village.reporters}</td>
                  <td className="px-3 py-3 text-slate-600">{village.posts}</td>
                  <td className="px-3 py-3 text-slate-600">{village.health}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
