import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'
import { CATEGORY_META, getCategorySlugFromLabel, normalizeCategory } from '../utils/categoryUtils'

function Categories() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [newsItems, setNewsItems] = useState([])

  useEffect(() => {
    let mounted = true

    const loadNews = async () => {
      try {
        const approved = await getApprovedSubmissions()
        if (mounted) setNewsItems(approved || [])
      } catch {
        if (mounted) setNewsItems([])
      }
    }

    loadNews()

    const unsubscribe = subscribeToModerationChanges((state) => {
      if (mounted) setNewsItems(state.approved || [])
    })

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const categoryCounts = useMemo(() => {
    const counts = {}
    newsItems.forEach((item) => {
      const slug = normalizeCategory(item.category)
      counts[slug] = (counts[slug] || 0) + 1
    })
    return counts
  }, [newsItems])

  const categoryOrder = ['agriculture', 'health', 'education', 'business', 'sports', 'government', 'commodities', 'weather']

  const categories = categoryOrder.map((slug, index) => {
    const meta = CATEGORY_META[slug]
    return {
      id: index + 1,
      slug,
      name: meta.label,
      icon: meta.icon,
      color: meta.color,
      count: `${categoryCounts[slug] || 0} ${t('stories')}`,
    }
  })

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
                onClick={() => navigate(`/category/${getCategorySlugFromLabel(cat.slug)}`)}
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
