import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'

function Categories() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const getCategorySlug = (categoryName) => {
    const slugMap = {
      'agriculture': 'agriculture',
      'health': 'health',
      'education': 'education',
      'business': 'business',
      'sports': 'sports',
      'government': 'government',
      'mandiRates': 'commodities',
      'weather': 'weather'
    }
    return slugMap[categoryName] || categoryName.toLowerCase()
  }
  
  const categories = [
    { id: 1, name: t('agriculture'), icon: '🌾', color: 'from-green-50 to-emerald-50', count: '245 ' + t('stories') },
    { id: 2, name: t('health'), icon: '⚕️', color: 'from-blue-50 to-sky-50', count: '128 ' + t('stories') },
    { id: 3, name: t('education'), icon: '📚', color: 'from-yellow-50 to-amber-50', count: '189 ' + t('stories') },
    { id: 4, name: t('business'), icon: '💼', color: 'from-purple-50 to-indigo-50', count: '156 ' + t('stories') },
    { id: 5, name: t('sports'), icon: '⚽', color: 'from-red-50 to-rose-50', count: '93 ' + t('stories') },
    { id: 6, name: t('government'), icon: '🏛️', color: 'from-orange-50 to-amber-50', count: '267 ' + t('stories') },
    { id: 7, name: t('mandiRates'), icon: '💹', color: 'from-cyan-50 to-blue-50', count: '312 ' + t('stories') },
    { id: 8, name: t('weather'), icon: '🌤️', color: 'from-teal-50 to-cyan-50', count: '89 ' + t('stories') },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('allCategories')} subtitle={t('findNews')} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => navigate(`/category/${getCategorySlug(cat.name)}`)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`rounded-2xl bg-gradient-to-br ${cat.color} p-4 border border-slate-200 shadow-soft transition text-left hover:shadow-md sm:p-6`}
              >
                <p className="text-2xl sm:text-3xl">{cat.icon}</p>
                <h3 className="mt-2 text-sm font-extrabold leading-5 text-navy-900">{cat.name}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">{cat.count}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default Categories
