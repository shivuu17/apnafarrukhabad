import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import ImageWithFallback from '../components/ImageWithFallback'
import { useEffect, useState } from 'react'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'
import { Modal } from '../components/ui/Modals'

function News() {
  const { t } = useLanguage()
  const [newsItems, setNewsItems] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)

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

  const handleShare = async (item) => {
    const shareText = `${item.title}\n\n${item.category}`
    const shareUrl = `${window.location.origin}/?newsId=${item.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${item.title}\n${shareUrl}`)
        alert('Link copied to clipboard!')
      } catch {
        alert('Unable to copy. Please share manually.')
      }
    }
  }

  const closeStory = () => setSelectedNews(null)

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('allNews')} subtitle={t('everyNews')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newsItems.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-soft">
                <p className="text-sm font-semibold text-slate-700">No approved news is available yet.</p>
                <p className="mt-1 text-xs text-slate-500">Published reports will appear here once an admin approves them.</p>
              </div>
            ) : newsItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft flex flex-col"
              >
                {item.imageUrl ? (
                  <ImageWithFallback src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover sm:h-48" />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-slate-400 sm:h-48">No image</div>
                )}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-agri-50 px-2.5 py-1 text-xs font-bold text-agri-700">
                      {item.category || 'News'}
                    </span>
                    <span className="text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently approved'}</span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-extrabold leading-6 text-navy-900 sm:text-base">{item.title}</h3>
                  <div className="mt-3 flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNews(item)}
                      className="w-full rounded-lg bg-[#0f6a2f] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5a28]"
                    >
                      {t('readMore')}
                    </motion.button>
                    <button
                      onClick={() => handleShare(item)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      title="Share this news"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      {selectedNews && (
        <Modal isOpen={Boolean(selectedNews)} onClose={closeStory} title={selectedNews.title} size="lg">
          <div className="space-y-4">
            {selectedNews.imageUrl ? (
              <ImageWithFallback src={selectedNews.imageUrl} alt={selectedNews.title} className="h-56 w-full rounded-2xl object-cover" />
            ) : null}

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-agri-50 px-2.5 py-1 font-bold text-agri-700">
                {selectedNews.category || 'News'}
              </span>
              <span>{selectedNews.village || selectedNews.locationName || 'Farrukhabad'}</span>
              <span>{selectedNews.createdAt ? new Date(selectedNews.createdAt).toLocaleString() : 'Recently approved'}</span>
            </div>

            <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {selectedNews.description || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleShare(selectedNews)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Share
              </button>
              <button
                type="button"
                onClick={closeStory}
                className="rounded-lg bg-[#0f6a2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b5a28]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
      <MobileNav />
    </div>
  )
}

export default News
