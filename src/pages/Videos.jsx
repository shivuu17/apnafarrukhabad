import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import ImageWithFallback from '../components/ImageWithFallback'

function Videos() {
  const { t } = useLanguage()
  
  const videos = [
    { id: 1, title: 'खेती की नई तकनीक', thumbnail: 'https://via.placeholder.com/300x200?text=Video+1', duration: '5:42', views: '12.5K' },
    { id: 2, title: 'गांव की परंपरा', thumbnail: 'https://via.placeholder.com/300x200?text=Video+2', duration: '8:15', views: '8.3K' },
    { id: 3, title: 'युवा किसानों की सफलता', thumbnail: 'https://via.placeholder.com/300x200?text=Video+3', duration: '6:30', views: '15.2K' },
    { id: 4, title: 'बाजार के रहस्य', thumbnail: 'https://via.placeholder.com/300x200?text=Video+4', duration: '7:10', views: '9.8K' },
    { id: 5, title: 'मौसम और फसल', thumbnail: 'https://via.placeholder.com/300x200?text=Video+5', duration: '4:25', views: '6.1K' },
    { id: 6, title: 'गांव की सड़क निर्माण', thumbnail: 'https://via.placeholder.com/300x200?text=Video+6', duration: '9:00', views: '11.7K' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('videoGallery')} subtitle={t('watchLearn')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => (
              <motion.button
                key={video.id}
                onClick={() => alert(`🎬 Playing: ${video.title}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="text-left overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-soft transition hover:shadow-md"
              >
                <div className="relative h-40 w-full bg-slate-800 sm:h-44">
                  <ImageWithFallback src={video.thumbnail} alt={video.title} className="h-full w-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur">
                      <Play size={24} className="text-black fill-black" />
                    </div>
                  </motion.div>
                  <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-extrabold leading-6 text-navy-900 sm:text-base">{video.title}</h3>
                  <p className="mt-2 text-xs text-slate-400">👁️ {video.views} {t('views')}</p>
                </div>
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

export default Videos
