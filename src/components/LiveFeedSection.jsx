import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, MessageCircle, Share2, BadgeCheck } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { feedData } from '../data/homeData'

const BATCH = 3

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-soft">
      <div className="h-48 sm:h-44 w-full animate-pulse rounded-2xl bg-slate-200" />
      <div className="p-4 sm:p-3 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  )
}

function LiveFeedSection() {
  const [visibleCount, setVisibleCount] = useState(BATCH)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState({})
  const sentinelRef = useRef(null)

  const handleShare = (title) => alert(`📤 Sharing "${title}"...`)
  const handleBookmark = (id, title) => {
    alert(`🔖 ${bookmarked[id] ? 'Removed from' : 'Added to'} bookmarks!`)
    setBookmarked({ ...bookmarked, [id]: !bookmarked[id] })
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const visibleItems = useMemo(() => feedData.slice(0, visibleCount), [visibleCount])

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && visibleCount < feedData.length) {
          setVisibleCount((v) => Math.min(v + BATCH, feedData.length))
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [visibleCount])

  return (
    <section className="px-3 pt-6 sm:px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="From Your District" subtitle="Live reports from Farrukhabad" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
            : visibleItems.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-soft"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  className="h-48 sm:h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-agri-50 px-3 py-1.5 text-xs sm:text-[11px] font-bold text-agri-700">
                      {item.village}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs sm:text-[11px] font-bold text-slate-600">
                      {item.category}
                    </span>
                    <span className="ml-auto text-xs sm:text-[11px] font-semibold text-slate-400">{item.time}</span>
                  </div>
                  <h3 className="mt-3 text-base sm:text-[15px] font-extrabold leading-tight text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.summary}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={item.avatar}
                      alt={item.reporter}
                      loading="lazy"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <p className="text-xs font-semibold text-slate-700">{item.reporter}</p>
                    <BadgeCheck size={15} className="text-agri-700" />
                    <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold">
                        <MessageCircle size={13} /> {item.comments}
                      </span>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(item.title)}
                        type="button" 
                        className="rounded-lg border border-slate-200 p-2 active:scale-95 transition"
                      >
                        <Share2 size={14} />
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBookmark(item.title, item.title)}
                        type="button" 
                        className={`rounded-lg border p-2 transition active:scale-95 ${
                          bookmarked[item.title] 
                            ? 'border-agri-300 bg-agri-50 text-agri-600' 
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <Bookmark size={14} fill={bookmarked[item.title] ? 'currentColor' : 'none'} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>

        <div ref={sentinelRef} className="h-3" />
      </div>
    </section>
  )
}

export default LiveFeedSection
