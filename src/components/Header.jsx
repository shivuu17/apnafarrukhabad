import { Menu, Bell, Search, ChevronDown, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'
import AFLogo from '../assets/AF.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import useAuth from '../hooks/useAuth'

function Header({ scrolled }) {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [villagesMenuOpen, setVillagesMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const isAdmin = ['admin', 'superadmin', 'moderator'].includes(String(user?.role || '').trim().toLowerCase()) || Boolean(user?.isAdmin)

  const handleSearch = () => navigate('/news')
  const handleAbout = () => navigate('/about')
  const handleAdvertise = () => navigate('/advertise')
  const handleContact = () => navigate('/contact')
  const handleLogin = () => navigate('/login')
  const handleSignUp = () => navigate('/signup')
  const handleLogout = async () => {
    await logout()
    setProfileMenuOpen(false)
    navigate('/')
  }
  const handleProfile = () => {
    setProfileMenuOpen(false)
    navigate('/profile')
  }
  const handleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const handleMobileNavigate = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
    setVillagesMenuOpen(false)
  }
  const handleVillageSelect = (village) => {
    navigate(`/villages?village=${encodeURIComponent(village.slug)}`)
    setVillagesMenuOpen(false)
  }

  const villages = [
    { name: 'फर्रुखाबाद', slug: 'farrukhabad' },
    { name: 'खेतपुर', slug: 'khetpur' },
    { name: 'नई बस्ती', slug: 'nai-basti' },
    { name: 'मोहम्मदपुर', slug: 'mohammadpur' },
    { name: 'रायपुर', slug: 'raipur' },
    { name: 'गंगाखेड़ा', slug: 'gangakheda' },
  ]
  
  const NAV_HANDLERS = {
    [t('home')]: () => navigate('/'),
    [t('news')]: () => navigate('/news'),
    [t('categories')]: () => navigate('/categories'),
    [t('villages')]: () => navigate('/villages'),
    [t('videos')]: () => navigate('/videos'),
    [t('report')]: () => navigate('/report'),
    [t('trending')]: () => navigate('/trending')
  }
  
  const handleNavClick = (item) => {
    const handler = NAV_HANDLERS[item]
    if (handler) handler()
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top thin dark green strip */}
      <div className="bg-[#06391c] text-white text-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-1.5">
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-white font-bold">● LIVE</span>
            <div className="min-w-0 overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-[12px] font-semibold opacity-95 sm:text-[13px]">
                {t('liveMarquee')}
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-[13px] sm:flex">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="#60A5FA"/></svg>
              <span>{t('weatherToday')} 28°C</span>
            </div>
            <button onClick={handleAbout} className="opacity-90 hover:underline cursor-pointer transition">{t('about')}</button>
            <button onClick={handleAdvertise} className="opacity-90 hover:underline cursor-pointer transition">{t('advertise')}</button>
            <button onClick={handleContact} className="opacity-90 hover:underline cursor-pointer transition">{t('contact')}</button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="ml-2 rounded-lg bg-white/20 px-3 py-1 font-bold text-white transition hover:bg-white/30"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* White navbar */}
      <motion.div
        animate={{
          backdropFilter: scrolled ? 'blur(14px)' : 'blur(6px)',
          backgroundColor: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.98)'
        }}
        transition={{ duration: 0.2 }}
        className="mx-auto my-2 max-w-6xl rounded-[22px] border border-emerald-100 px-3 py-3 shadow-sm sm:my-3 sm:px-4 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo & tagline */}
          <div className="flex min-w-0 items-center gap-3">
            <img src={AFLogo} alt="ApnaFarrukhabad" loading="eager" decoding="async" className="h-10 w-10 rounded-2xl object-cover shadow-sm sm:h-12 sm:w-12" />
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-[#0f6a2f] sm:text-xl">ApnaFarrukhabad</p>
              <p className="truncate text-[11px] font-semibold text-slate-500 sm:text-[12px]">हर खबर, हर गांव, हर इंसान की बात</p>
            </div>
          </div>

          {/* Center: Nav (hidden on small screens) */}
          <nav className="hidden flex-1 px-6 sm:flex items-center justify-center">
            <ul className="flex items-center gap-6 text-sm font-semibold text-slate-700">
              <li>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('home'))}
                  className="text-[#0f6a2f] transition hover:opacity-75"
                >
                  {t('home')}
                </motion.button>
              </li>
              <li>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('news'))}
                  className="transition hover:opacity-75"
                >
                  {t('news')}
                </motion.button>
              </li>
              <li>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('categories'))}
                  className="flex items-center gap-1 transition hover:opacity-75"
                >
                  {t('categories')} <span className="text-xs">▾</span>
                </motion.button>
              </li>
              <li>
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVillagesMenuOpen((open) => !open)}
                    className="flex items-center gap-1 transition hover:opacity-75"
                  >
                    {t('villages')} <ChevronDown size={14} />
                  </motion.button>
                  {villagesMenuOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                      {villages.map((village) => (
                        <button
                          key={village.slug}
                          type="button"
                          onClick={() => handleVillageSelect(village)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <span>{village.name}</span>
                          <span className="text-xs text-slate-400">News</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('videos'))}
                  className="transition hover:opacity-75"
                >
                  {t('videos')}
                </motion.button>
              </li>
              <li>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('report'))}
                  className="transition hover:opacity-75"
                >
                  {t('report')}
                </motion.button>
              </li>
              <li>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(t('trending'))}
                  className="transition hover:opacity-75"
                >
                  {t('trending')}
                </motion.button>
              </li>
            </ul>
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={handleSearch}
              whileTap={{ scale: 0.95 }}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 sm:inline-flex"
              aria-label="search"
            >
              <Search size={18} />
            </motion.button>

            {user ? (
              <div className="relative hidden sm:block">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <User size={16} />
                  <span className="text-sm">{user.name}</span>
                  <ChevronDown size={14} />
                </motion.button>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      {isAdmin && <p className="mt-1 text-xs font-semibold text-emerald-700">👨‍💼 Admin</p>}
                    </div>
                    <button
                      onClick={handleProfile}
                      className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      My Profile
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => navigate('/admin')}
                        className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-t border-slate-100"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      <span className="flex items-center gap-2"><LogOut size={14} /> Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="hidden rounded-lg border border-emerald-300 px-5 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50 transition active:scale-95 sm:inline-flex"
                >
                  {t('login')}
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignUp}
                  className="hidden rounded-lg bg-[#0f6a2f] px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-[#0b5a28] transition active:scale-95 sm:inline-flex"
                >
                  {t('signup')}
                </motion.button>
              </>
            )}

            <motion.button
              type="button"
              onClick={handleMobileMenu}
              whileTap={{ scale: 0.95 }}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 sm:hidden"
              aria-label="menu"
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-[50vw] min-w-[280px] max-w-[360px] flex-col border-l border-emerald-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
              <p className="text-sm font-bold text-slate-900">Menu</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                >
                  {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
                </button>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-95"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <div className="grid grid-cols-1 gap-2.5 text-sm font-semibold text-slate-700">
                <button onClick={() => handleMobileNavigate('/')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('home')}</button>
                <button onClick={() => handleMobileNavigate('/news')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('news')}</button>
                <button onClick={() => handleMobileNavigate('/categories')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('categories')}</button>
                <button onClick={() => handleMobileNavigate('/villages')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('villages')}</button>
                <button onClick={() => handleMobileNavigate('/videos')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('videos')}</button>
                <button onClick={() => handleMobileNavigate('/report')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('report')}</button>
                <button onClick={() => handleMobileNavigate('/trending')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('trending')}</button>
                <button onClick={() => handleMobileNavigate('/about')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('about')}</button>
                <button onClick={() => handleMobileNavigate('/contact')} className="rounded-xl bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 active:bg-slate-200 transition">{t('contact')}</button>
              </div>
            </div>

            <div className="border-t border-slate-100 p-3 pb-24">
              {user ? (
                <div className="space-y-2">
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm font-bold text-emerald-700">{user.name}</p>
                    <p className="text-xs text-slate-600">{user.email}</p>
                    {isAdmin && <p className="mt-1 text-xs font-semibold text-emerald-700">👨‍💼 Admin</p>}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleMobileNavigate('/admin')}
                      className="block w-full rounded-xl bg-slate-50 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <button onClick={() => handleMobileNavigate('/login')} className="rounded-xl bg-emerald-50 px-4 py-3 text-left font-bold text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition">{t('login')}</button>
                  <button onClick={() => handleMobileNavigate('/signup')} className="rounded-xl bg-[#0f6a2f] px-4 py-3 text-left font-bold text-white hover:bg-[#0b5a28] active:bg-[#09472a] transition">{t('signup')}</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </header>
  )
}

export default Header

