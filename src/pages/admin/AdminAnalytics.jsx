const trafficBars = [56, 72, 48, 84, 66, 90, 76]
const growthBars = [34, 44, 58, 52, 68, 74, 82]

const topVillages = [
  { name: 'Kaimganj', score: '18.4k views' },
  { name: 'Rajepur', score: '16.1k views' },
  { name: 'Shamsabad', score: '14.7k views' },
  { name: 'Mohammadabad', score: '13.2k views' },
]

const topCategories = [
  { name: 'Agriculture', share: '28%' },
  { name: 'Civic Works', share: '21%' },
  { name: 'Education', share: '17%' },
  { name: 'Local Business', share: '14%' },
]

export default function AdminAnalytics() {
  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">District trends, category performance, and village reach.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-[#0f6a2f]">Traffic Heatmap</h3>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {trafficBars.map((height, index) => (
              <div key={`traffic-${index}`} className="flex h-24 items-end rounded-xl bg-emerald-50 p-1">
                <div style={{ height: `${height}%` }} className="w-full rounded-lg bg-gradient-to-t from-[#0B6B3A] to-[#14B86A]" />
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-lg font-black text-[#0f6a2f]">7-day Growth Trend</h3>
          <div className="mt-3 space-y-2">
            {growthBars.map((value, index) => (
              <div key={`growth-${index}`} className="flex items-center gap-3">
                <span className="w-8 text-xs text-slate-500">D{index + 1}</span>
                <div className="h-2.5 flex-1 rounded-full bg-emerald-50">
                  <div style={{ width: `${value}%` }} className="h-2.5 rounded-full bg-[#14B86A]" />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-slate-600">{value}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
            <h4 className="text-base font-black text-[#0f6a2f]">Top Villages</h4>
            <div className="mt-4 space-y-3">
              {topVillages.map((village) => (
                <div key={village.name} className="flex items-center justify-between rounded-2xl bg-[#f7fbf8] px-3 py-2">
                  <span className="text-sm font-semibold text-slate-700">{village.name}</span>
                  <span className="text-xs font-bold text-[#14B86A]">{village.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
            <h4 className="text-base font-black text-[#0f6a2f]">Top Categories</h4>
            <div className="mt-4 space-y-3">
              {topCategories.map((category) => (
                <div key={category.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{category.name}</span>
                    <span className="font-bold text-[#14B86A]">{category.share}</span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-50">
                    <div style={{ width: category.share }} className="h-2 rounded-full bg-gradient-to-r from-[#0B6B3A] to-[#14B86A]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}