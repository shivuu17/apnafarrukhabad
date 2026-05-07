import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import ImageWithFallback from '../components/ImageWithFallback'

function News() {
  const { t } = useLanguage()
  
  const newsItems = [
    { id: 1, title: t('agriculture'), category: t('agriculture'), time: '2 घंटे पहले', image: 'https://via.placeholder.com/400x250?text=News+1' },
    { id: 2, title: t('education'), category: t('education'), time: '4 घंटे पहले', image: 'https://via.placeholder.com/400x250?text=News+2' },
    { id: 3, title: t('mandiRates'), category: 'बाजार', time: '6 घंटे पहले', image: 'https://via.placeholder.com/400x250?text=News+3' },
    { id: 4, title: t('government'), category: 'सरकारी', time: '1 दिन पहले', image: 'https://via.placeholder.com/400x250?text=News+4' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('allNews')} subtitle={t('everyNews')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newsItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
              >
                <ImageWithFallback src={item.image} alt={item.title} className="h-40 w-full object-cover sm:h-48" />
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-agri-50 px-2.5 py-1 text-xs font-bold text-agri-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-extrabold leading-6 text-navy-900 sm:text-base">{item.title}</h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert(`📰 Reading: ${item.title}`)}
                    className="mt-3 w-full rounded-lg bg-[#0f6a2f] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5a28]"
                  >
                    {t('readMore')}
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default News
