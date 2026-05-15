import { Home, Compass, PlusCircle, Store, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Modal } from './ui/Modals'

function MobileNav() {
  const { t } = useLanguage()
  const [showMarketModal, setShowMarketModal] = useState(false)

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('explore'), icon: Compass, path: '/villages' },
    { label: t('upload'), icon: PlusCircle, path: '/report' },
    { label: t('market'), icon: Store, path: '#' },
    { label: t('profile'), icon: User, path: '/profile' }
  ]

  const handleMarketClick = (event) => {
    event.currentTarget.blur()
    setShowMarketModal(true)
  }

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 px-2 pb-[env(safe-area-inset-bottom)] pt-2 sm:hidden">
        <div className="mx-auto flex max-w-lg items-stretch gap-1 rounded-[24px] border border-emerald-100 bg-white/98 p-2 shadow-lg backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon

            if (item.path === '#') {
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={handleMarketClick}
                  whileTap={{ scale: 0.9 }}
                  className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-transparent bg-white px-1 py-2 text-[11px] font-bold text-slate-700 transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:scale-95 hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#0f6a2f]"
                >
                  <Icon size={18} className="text-current" />
                  <span className="truncate text-center leading-tight">{item.label}</span>
                </motion.button>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/'}
                onClick={(event) => event.currentTarget.blur()}
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 text-[11px] font-bold transition-all duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:scale-95 ${
                  isActive
                    ? 'border-emerald-200 bg-emerald-50 text-[#0f6a2f] shadow-sm'
                    : 'border-transparent bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#0f6a2f]'
                }`}
              >
                <Icon size={18} className="text-current" />
                <span className="truncate text-center leading-tight">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <Modal
        isOpen={showMarketModal}
        onClose={() => setShowMarketModal(false)}
        title={t('comingSoonTitle')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('comingSoonBody')}</p>
          <p className="text-sm font-semibold text-emerald-700">{t('comingSoonTitle')}</p>
        </div>
      </Modal>
    </>
  )
}

export default MobileNav
