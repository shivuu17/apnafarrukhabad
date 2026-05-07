import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  Megaphone,
  Menu,
  MoonStar,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Shield,
  Sparkles,
  SunMedium,
  Users,
  MapPinned,
  TriangleAlert,
  Wallet,
} from 'lucide-react'

const navGroups = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Moderation', to: '/admin/moderation', icon: Shield },
  { label: 'Posts', to: '/admin', icon: Newspaper },
  { label: 'Breaking Alerts', to: '/admin', icon: TriangleAlert },
  { label: 'Villages', to: '/admin', icon: MapPinned },
  { label: 'Users', to: '/admin', icon: Users },
  { label: 'Reports', to: '/admin', icon: BellRing },
  { label: 'Analytics', to: '/admin', icon: LineChart },
  { label: 'Revenue', to: '/admin', icon: Wallet },
  { label: 'Settings', to: '/admin', icon: Settings2 },
]

function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('af_admin_theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      window.localStorage.setItem('af_admin_theme', 'dark')
    } else {
      root.classList.remove('dark')
      window.localStorage.setItem('af_admin_theme', 'light')
    }
  }, [darkMode])

  const title = useMemo(() => {
    if (location.pathname.includes('/moderation')) return 'Moderation Queue'
    return 'Dashboard Overview'
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,107,58,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(20,184,106,0.09),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.2),transparent)] dark:bg-[radial-gradient(circle_at_top_left,rgba(11,107,58,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(20,184,106,0.12),transparent_22%),linear-gradient(to_bottom,rgba(2,6,23,0.15),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">ApnaFarrukhabad Admin</p>
            <h1 className="truncate text-lg font-black text-slate-950 dark:text-white">{title}</h1>
          </div>

          <div className="hidden flex-1 items-center gap-3 xl:flex">
            <div className="relative max-w-lg flex-1">
              <input
                placeholder="Search posts, users, villages, alerts..."
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-900"
              />
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              Pending approvals <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">18</span>
            </button>

            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              Quick create post
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {darkMode ? <SunMedium size={16} /> : <MoonStar size={16} />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <BellRing size={16} /> 7
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <aside className={`fixed inset-y-[72px] left-4 z-20 w-72 overflow-y-auto rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/95 lg:sticky ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'} ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white shadow-lg dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <Shield size={22} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Admin profile</p>
                  <p className="text-lg font-black">Super Admin</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && <p className="mt-3 text-sm leading-6 text-slate-300">Operations console for posts, users, village analytics, banners, alerts, jobs, and AI moderation.</p>}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Sidebar</span>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          <nav className="mt-4 space-y-1">
            {navGroups.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'}`}
                >
                  <Icon size={16} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-5 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <BellRing size={18} className="text-amber-500" /> 7 urgent alerts
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Sparkles size={18} className="text-violet-500" /> AI moderation live
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPinned size={18} className="text-emerald-500" /> 5 village alerts
              </div>
            </div>
          )}
        </aside>

        <main className="min-h-[calc(100vh-120px)] flex-1 overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayoutimport React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BellRing,
  BarChart3,
  LayoutDashboard,
  Menu,
  MoonStar,
  Settings2,
  Shield,
  SunMedium,
  Users,
  Map,
  Sparkles,
} from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('af_admin_theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      window.localStorage.setItem('af_admin_theme', 'dark')
    } else {
      root.classList.remove('dark')
      window.localStorage.setItem('af_admin_theme', 'light')
    }
  }, [darkMode])

  const navItems = useMemo(
    () => [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/moderation', label: 'Moderation', icon: Shield },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.2),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-white/75 backdrop-blur-xl dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-emerald-600">ApnaFarrukhabad Admin</p>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">Premium Control Center</h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              Live moderation sync
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {darkMode ? <SunMedium size={16} /> : <MoonStar size={16} />}
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className={`fixed inset-y-[73px] left-4 z-20 w-72 overflow-y-auto rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/95 lg:sticky lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}`}>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white shadow-lg dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Admin Role</p>
                <p className="text-lg font-black">Super Control</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Manage posts, users, ads, alerts, complaints, and AI moderation from one place.</p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'}`}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-5 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-sky-500" />
              <p className="text-sm font-semibold">Today&apos;s pulse</p>
            </div>
            <div className="flex items-center gap-3">
              <Users size={18} className="text-emerald-500" />
              <p className="text-sm text-slate-600 dark:text-slate-300">142 active reviewers</p>
            </div>
            <div className="flex items-center gap-3">
              <BellRing size={18} className="text-amber-500" />
              <p className="text-sm text-slate-600 dark:text-slate-300">7 urgent notifications queued</p>
            </div>
            <div className="flex items-center gap-3">
              <Map size={18} className="text-rose-500" />
              <p className="text-sm text-slate-600 dark:text-slate-300">5 inactive village alerts</p>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-violet-500" />
              <p className="text-sm text-slate-600 dark:text-slate-300">AI moderation is live</p>
            </div>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-120px)] flex-1 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:p-6 lg:p-8">
          <div className="lg:pl-0">{location.pathname.startsWith('/admin') ? <Outlet /> : <Outlet />}</div>
        </main>
      </div>
    </div>
  )
}
