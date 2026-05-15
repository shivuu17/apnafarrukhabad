import { motion } from 'framer-motion'
import { MessageCircle, Bookmark } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import ImageWithFallback from '../components/ImageWithFallback'

function Trending() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('trendingNews')} subtitle={t('nowTrending')} />
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bookmark size={24} />
            </div>
            <h3 className="mt-4 text-lg font-black text-navy-900">No trending placeholders</h3>
            <p className="mt-2 text-sm text-slate-500">
              Hook this page to real trending metrics when your backend is ready.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default Trending
