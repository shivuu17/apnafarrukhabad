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
  
  const trendingStories = [
    { 
      id: 1, 
      title: 'गेहूं के दाम में अचानक वृद्धि', 
      rank: 1, 
      trending: '🔥 21K searches',
      comments: 245,
      image: 'https://via.placeholder.com/400x250?text=Trending+1'
    },
    { 
      id: 2, 
      title: 'नई कृषि प्रौद्योगिकी का प्रदर्शन', 
      rank: 2, 
      trending: '🔥 18.5K searches',
      comments: 198,
      image: 'https://via.placeholder.com/400x250?text=Trending+2'
    },
    { 
      id: 3, 
      title: 'गांव में मोबाइल एक्सेस सेंटर खुला', 
      rank: 3, 
      trending: '🔥 15.2K searches',
      comments: 167,
      image: 'https://via.placeholder.com/400x250?text=Trending+3'
    },
    { 
      id: 4, 
      title: 'किसानों की आत्महत्या दर में कमी', 
      rank: 4, 
      trending: '⬆️ 12K searches',
      comments: 142,
      image: 'https://via.placeholder.com/400x250?text=Trending+4'
    },
    { 
      id: 5, 
      title: 'युवा किसान सफलता की कहानियां', 
      rank: 5, 
      trending: '⬆️ 9.8K searches',
      comments: 121,
      image: 'https://via.placeholder.com/400x250?text=Trending+5'
    },
    { 
      id: 6, 
      title: 'मंडी सुधार योजना की सफलता', 
      rank: 6, 
      trending: '⬆️ 8.3K searches',
      comments: 98,
      image: 'https://via.placeholder.com/400x250?text=Trending+6'
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('trendingNews')} subtitle={t('nowTrending')} />
          <div className="space-y-3 sm:space-y-4">
            {trendingStories.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:shadow-md"
              >
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:p-4">
                  <div className="h-40 overflow-hidden rounded-xl sm:h-28 sm:w-36 sm:flex-shrink-0">
                    <ImageWithFallback
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Rank */}
                  <div className="flex min-w-[60px] flex-row items-center justify-between rounded-xl bg-gradient-to-br from-saffron-100 to-orange-100 px-3 py-2 sm:flex-col sm:justify-center">
                    <p className="text-xl font-black text-saffron-600 sm:text-2xl">#{story.rank}</p>
                    <p className="text-[11px] font-bold text-orange-600 sm:text-xs">Trending</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <motion.button
                          onClick={() => alert(`📰 Reading: ${story.title}`)}
                          whileTap={{ scale: 0.98 }}
                          className="text-left"
                        >
                          <h3 className="text-[15px] font-extrabold leading-6 text-navy-900 sm:text-base line-clamp-2">{story.title}</h3>
                        </motion.button>
                        <p className="mt-1 text-xs font-bold text-red-600">{story.trending}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 sm:gap-3">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                        <MessageCircle size={13} /> {story.comments}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => alert(`🔖 Bookmarked: ${story.title}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 transition hover:bg-slate-50"
                      >
                        <Bookmark size={13} /> {t('save')}
                      </motion.button>
                    </div>
                  </div>
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

export default Trending
