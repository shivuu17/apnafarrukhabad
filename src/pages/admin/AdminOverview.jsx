import { useNavigate } from 'react-router-dom'

const kpis = [
  { label: 'Pending Review', value: '148', delta: '+12 in last hour' },
  { label: 'Live Posts', value: '12,486', delta: '+4.8% today' },
  { label: 'Daily Active Readers', value: '84.2k', delta: '+7.4%' },
  { label: 'Active Reporters', value: '312', delta: '+18 this week' },
]

const activities = [
  { text: 'New upload from Rajepur by Ravi Tiwari', time: '2m ago' },
  { text: 'Post P-8702 approved by Moderator A', time: '6m ago' },
  { text: 'Fake-news report escalated for P-8691', time: '12m ago' },
  { text: 'Breaking ticker pushed to all village feeds', time: '18m ago' },
]

export default function AdminOverview() {
  const navigate = useNavigate()

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_12px_30px_rgba(6,57,28,0.1)]">
        <div className="bg-[#06391c] px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-100">
          Live Ops • District Desk • Internal Control Center
        </div>
        <div className="bg-gradient-to-r from-[#0f6a2f] to-[#1a8a45] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-100">Command Center</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black leading-tight">Farrukhabad district operations are stable</h2>
              <p className="mt-2 max-w-3xl text-sm text-emerald-100/90">Use dedicated pages for request handling and analytics insights.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/news-requests')}
                className="admin-clickable rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25"
              >
                Open News Requests
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/analytics')}
                className="admin-clickable rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25"
              >
                Open Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.label} className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-[#0f6a2f]">{item.value}</p>
            <p className="mt-1 text-sm font-semibold text-[#14B86A]">{item.delta}</p>
          </article>
        ))}
      </div>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-[#0f6a2f]">Activity Stream</h3>
        <div className="mt-4 space-y-3">
          {activities.map((item) => (
            <article key={`${item.text}-${item.time}`} className="rounded-2xl border border-emerald-100 bg-[#f7fbf8] p-3">
              <p className="text-sm font-semibold text-slate-800">{item.text}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#14B86A]">{item.time}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}