import { Home, Compass, PlusCircle, Store, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function MobileNav() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const navItems = [
    { label: t('home'), icon: Home, active: true, path: '/' },
    { label: t('explore'), icon: Compass, path: '/villages' },
    { label: t('upload'), icon: PlusCircle, path: '/report' },
    { label: t('market'), icon: Store, path: '#' },
    { label: t('profile'), icon: User, path: '#' }
  ]

  const NAV_MESSAGES = {
    [t('home')]: '🏠 ' + t('home'),
    [t('explore')]: '🗺️ ' + t('explore'),
    [t('upload')]: '📸 ' + t('upload'),
    [t('market')]: '🛒 ' + t('market'),
    [t('profile')]: '👤 ' + t('profile')
  }

  const handleNavigation = (label, path) => {
    if (path && path !== '#') {
      navigate(path)
    } else {
      alert(NAV_MESSAGES[label] || `📱 Opening ${label}...`)
    }
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-2 pb-[env(safe-area-inset-bottom)] pt-2 sm:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 rounded-[24px] border border-emerald-100 bg-white/98 p-2 shadow-lg backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => handleNavigation(item.label, item.path)}
              whileTap={{ scale: 0.9 }}
              className={`flex h-16 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition active:scale-90 ${
                item.active
                  ? 'bg-gradient-to-r from-agri-700 to-agri-500 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} />
              <span className="mt-1 text-center leading-tight">{item.label}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
