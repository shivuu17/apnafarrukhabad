import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BellRing,
  LayoutDashboard,
  LineChart,
  Menu,
  Newspaper,
  Settings2,
  Sparkles,
  Users,
  MapPinned,
  TriangleAlert,
  Wallet,
  Shield,
} from 'lucide-react'
import AFLogo from '../assets/AF.png'

const navGroups = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'News Requests', to: '/admin/news-requests', icon: Newspaper },
  { label: 'Breaking Alerts', to: '/admin/breaking-alerts', icon: TriangleAlert },
  { label: 'Villages', to: '/admin/villages', icon: MapPinned },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Reports', to: '/admin/reports', icon: BellRing },
  { label: 'Analytics', to: '/admin/analytics', icon: LineChart },
  { label: 'Revenue', to: '/admin/revenue', icon: Wallet },
  { label: 'Settings', to: '/admin/settings', icon: Settings2 },
]

function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  })

  const title = useMemo(() => {
    if (location.pathname.includes('/breaking-alerts')) return 'Breaking Alerts'
    if (location.pathname.includes('/villages')) return 'Villages'
    if (location.pathname.includes('/users')) return 'Users'
    if (location.pathname.includes('/reports')) return 'Reports'
    if (location.pathname.includes('/news-requests')) return 'News Requests'
    if (location.pathname.includes('/analytics')) return 'Analytics'
    if (location.pathname.includes('/revenue')) return 'Revenue'
    if (location.pathname.includes('/settings')) return 'Settings'
    return 'Dashboard Overview'
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,106,47,0.1),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.09),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.25),transparent)] dark:bg-[radial-gradient(circle_at_top_left,rgba(11,107,58,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(20,184,106,0.12),transparent_22%),linear-gradient(to_bottom,rgba(2,6,23,0.15),transparent)]" />

      <header className="sticky top-0 z-30">
        <div className="bg-[#06391c] text-white">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-1.5 text-xs font-semibold sm:px-6 lg:px-8">
            <p className="truncate">● LIVE OPS: 148 pending review • 11 urgent reports • 3 breaking alerts</p>
            <p className="hidden sm:block text-emerald-200">ApnaFarrukhabad Admin Desk</p>
          </div>
        </div>

        <div className="mx-auto my-2 max-w-[1600px] rounded-[24px] border border-emerald-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            className="admin-clickable inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex flex-1 items-center gap-3">
            <img src={AFLogo} alt="ApnaFarrukhabad" className="h-10 w-10 rounded-2xl border border-emerald-100 object-cover shadow-sm" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0f6a2f] dark:text-emerald-300">ApnaFarrukhabad Admin</p>
              <h1 className="truncate text-lg font-black text-slate-950 dark:text-white">{title}</h1>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-3 xl:flex">
            <div className="relative max-w-lg flex-1">
              <input
                placeholder="Search posts, users, villages, alerts..."
                className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-900"
              />
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
        </div>
        </div>
      </header>

      <div className={`mx-auto flex px-4 py-5 transition-[max-width,gap,padding] duration-300 ease-out sm:px-6 lg:px-8 ${sidebarOpen ? 'max-w-[1600px] gap-5' : 'max-w-none gap-0'}`}>
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-10 bg-slate-900/35 transition-opacity duration-300 ease-out lg:hidden"
          />
        )}

        <aside className={`fixed inset-y-[102px] left-4 z-20 w-72 overflow-y-auto rounded-[28px] border border-emerald-100 bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,106,47,0.12)] backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out dark:border-slate-800 dark:bg-slate-950/95 ${sidebarOpen ? 'translate-x-0 opacity-100 lg:sticky' : '-translate-x-[120%] opacity-0 lg:hidden'}`}>
          <div className="rounded-[24px] bg-gradient-to-br from-[#06391c] to-[#0f6a2f] p-4 text-white shadow-lg dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Admin profile</p>
                <p className="text-lg font-black">Super Admin</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Operations console for posts, users, village analytics, banners, alerts, and revenue insights.</p>
          </div>

          <nav className="mt-4 space-y-1">
            {navGroups.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/admin'}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setSidebarOpen(false)
                    }
                  }}
                  className={({ isActive }) => `admin-clickable flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ease-out ${isActive ? 'bg-[#0f6a2f] text-white shadow-lg shadow-emerald-600/20' : 'text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-900'}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-5 space-y-3 rounded-[24px] border border-emerald-100 bg-[#f7fbf8] p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <BellRing size={18} className="text-amber-500" /> 7 urgent alerts
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Sparkles size={18} className="text-violet-500" /> AI review live
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <MapPinned size={18} className="text-emerald-500" /> 5 village alerts
            </div>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-120px)] flex-1 overflow-hidden rounded-[32px] border border-emerald-100/70 bg-white/95 p-4 shadow-[0_20px_55px_rgba(15,106,47,0.08)] backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-950/80 sm:p-6 lg:p-8">
          <div key={location.pathname} className="admin-route-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
export default AdminLayout
