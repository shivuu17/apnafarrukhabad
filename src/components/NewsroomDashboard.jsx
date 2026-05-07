import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Bookmark,
  Camera,
  ChevronRight,
  ChevronLeft,
  CloudRain,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  PenLine,
  PlayCircle,
  Siren,
  Wheat,
  AlertCircle,
  Share2,
} from 'lucide-react'
import { alerts, trendingTags } from '../data/homeData'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'

// Sample data - would be imported from homeData in production
const breakingNews = [
  {
    id: '1',
    title: 'Village transformer fault restored after 9-hour outage',
    summary: 'Residents and local linemen coordinated overnight, restoring power before school hours.',
    village: 'Usmanganj',
    reporter: 'Shabnam Khan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1100&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1100&q=80',
      'https://images.unsplash.com/photo-1581092162562-40038f37f767?auto=format&fit=crop&w=1100&q=80',
    ],
    category: 'Emergency',
    views: 1200,
    comments: 48,
    timestamp: '15m ago',
    verified: true,
  }
]

const newsItems = [
  {
    id: '2',
    type: 'farming',
    title: 'New irrigation canal approved for 12 villages',
    summary: 'Farmers reported improved irrigation timing after district-level review.',
    village: 'Amritpur',
    reporter: 'Ankit Chauhan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    comments: 42,
    timestamp: '32m ago',
    verified: true,
  },
  {
    id: '4',
    type: 'community',
    title: 'Students map pothole zones for road safety',
    summary: 'Citizen volunteers report 16 unsafe stretches to block office.',
    village: 'Mohammadabad',
    reporter: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    comments: 18,
    timestamp: '2h ago',
    verified: true,
  },
  {
    id: '5',
    type: 'farming',
    title: 'Leaf blight disease alert in Kayamganj',
    summary: 'Agricultural experts advise farmers on preventive measures.',
    village: 'Kayamganj',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    badge: 'High Risk',
    comments: 35,
    timestamp: '3h ago',
  },
  {
    id: '6',
    type: 'emergency',
    title: 'Drinking water contamination alert issued',
    summary: 'Health department advises boiling water before consumption.',
    village: 'Rajepur',
    icon: AlertCircle,
    comments: 52,
    timestamp: '4h ago',
  },
  {
    id: '7',
    type: 'community',
    title: 'New healthcare camp launched in remote villages',
    summary: 'Free medical checkups and medicines distributed today.',
    village: 'Multiple Villages',
    image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?auto=format&fit=crop&w=800&q=80',
    comments: 29,
    timestamp: '5h ago',
  },
]

const ctaItems = [
  {
    title: 'Report News',
    subtitle: 'Share local updates',
    icon: PenLine,
    tone: 'from-emerald-600 to-emerald-700',
  },
  {
    title: 'Upload Video',
    subtitle: 'Document your updates',
    icon: Camera,
    tone: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Explore Villages',
    subtitle: 'Discover your area',
    icon: MapPin,
    tone: 'from-amber-600 to-orange-600',
  },
]

const liveTickerItems = [
  '🌾 Wheat prices up 2.1% this week',
  '⚠️ Heavy rain warning for next 24 hours',
  '🚜 Farmer training workshop in Kayamganj',
  '📱 Download app for instant notifications',
  '🏥 Health camp returns next Monday',
]

function DistrictTopStrip() {
  return null
}

function LargeBreakingCard() {
  const item = breakingNews[0]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const images = item.images || [item.image]

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    alert(isBookmarked ? '📌 Removed from bookmarks' : '📌 Added to bookmarks')
  }

  const handleReadMore = () => {
    alert(`📖 Opening full story: "${item.title}"`)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 shadow-lg transition-transform duration-200 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative min-h-[280px] sm:min-h-[360px] md:min-h-[380px]">
        {/* Image Slider */}
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentImageIndex]}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.85))]" />

        {/* Breaking News Badge */}
        <div className="absolute left-0 top-0 m-4 inline-flex items-center gap-1 rounded-full bg-red-600 px-4 py-2 shadow-lg">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-[12px] font-extrabold uppercase tracking-wider text-white">Breaking News</span>
        </div>

        {/* Bookmark */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmark}
          type="button"
          className={`absolute right-0 top-0 m-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 ${
            isBookmarked ? 'bg-white/30 border-white/50' : ''
          }`}
          aria-label="bookmark"
        >
          <Bookmark size={16} fill={isBookmarked ? 'white' : 'none'} />
        </motion.button>

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={goToPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:border-white/50"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={goToNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:border-white/50"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </motion.button>
          </>
        )}

        {/* Image Indicators Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition ${
                  idx === currentImageIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 w-2 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 md:p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-3.5 py-1.5 text-[12px] font-bold text-white shadow-lg">
            <MapPin size={13} /> {item.village}, Farrukhabad
          </div>

          <h2 className="mt-3 text-[24px] font-black leading-[1.1] tracking-tight sm:mt-4 sm:text-[32px] md:text-[40px]">
            {item.title}
          </h2>

          <p className="mt-2 max-w-[50ch] text-[14px] leading-6 text-white/90 sm:mt-3 sm:text-[15px]">
            {item.summary}
          </p>

          {/* Stats */}
          <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-4 text-sm text-white/75 sm:gap-6">
              <span className="inline-flex items-center gap-1.5">
                <Eye size={16} /> {item.views}K
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle size={16} /> {item.comments}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReadMore}
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25 sm:w-auto"
            >
              Read More <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function NewsCard({ item, index }) {
  const Icon = item.icon

  if (item.type === 'weather' && Icon) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="flex flex-col rounded-[24px] border border-slate-200 bg-gradient-to-br from-blue-600 to-cyan-600 p-4 text-white shadow-lg transition hover:shadow-xl hover:-translate-y-1 sm:p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-white/90">Weather Alert</p>
            <h3 className="mt-2 text-[18px] font-black leading-6 sm:text-[20px]">{item.title}</h3>
            <p className="mt-2 text-[14px] leading-6 text-white/85">{item.summary}</p>
          </div>
          <Icon size={28} className="ml-2 shrink-0 text-white/80" />
        </div>
        <div className="mt-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white w-fit">
          {item.timestamp}
        </div>
      </motion.article>
    )
  }

  if (item.type === 'emergency' && Icon) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="flex flex-col rounded-[24px] border border-slate-200 bg-gradient-to-br from-red-600 to-rose-600 p-4 text-white shadow-lg transition hover:shadow-xl hover:-translate-y-1 sm:p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-white/90">Emergency Alert</p>
            <h3 className="mt-2 text-[18px] font-black leading-6 sm:text-[20px]">{item.title}</h3>
            <p className="mt-2 text-[14px] leading-6 text-white/85">{item.summary}</p>
          </div>
          <Icon size={28} className="ml-2 shrink-0 text-white/80" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white">
            {item.timestamp}
          </span>
        </div>
      </motion.article>
    )
  }

  // Image-based card
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg transition hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-slate-200 sm:h-48">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-lg">
            {item.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
            {item.type === 'farming' ? '🌾 Farming' : item.type === 'community' ? '👥 Community' : item.village}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">{item.timestamp}</span>
        </div>

        <h3 className="mt-3 text-[16px] font-black leading-6 text-slate-900 sm:text-[17px]">{item.title}</h3>
        <p className="mt-2 flex-1 text-[13px] leading-5 text-slate-600">{item.summary}</p>

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {item.avatar && (
              <div className="flex items-center gap-2">
                <img src={item.avatar} alt={item.reporter} className="h-8 w-8 rounded-full object-cover" />
                <div className="flex flex-col">
                  <p className="text-[12px] font-bold text-slate-900">{item.reporter}</p>
                  {item.verified && <span className="text-[10px] text-emerald-600 font-semibold">✓ Verified</span>}
                </div>
              </div>
            )}
          </div>
          <span className="text-[12px] font-semibold text-slate-500 sm:text-right">{item.comments} comments</span>
        </div>
      </div>
    </motion.article>
  )
}

function CTARow() {
  const [activeButton, setActiveButton] = useState(null)
  const navigate = useNavigate()
  
  const handleCTAClick = (title) => {
    setActiveButton(title)
    const routes = {
      'Report News': '/report',
      'Upload Video': '/upload-video',
      'Explore Villages': '/villages'
    }
    
    // Navigate after a brief delay to show the tap animation
    setTimeout(() => {
      navigate(routes[title] || '/')
      setActiveButton(null)
    }, 300)
  }

  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ctaItems.map((item, idx) => {
        const Icon = item.icon
        const isActive = activeButton === item.title
        return (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            onClick={() => handleCTAClick(item.title)}
            type="button"
            className={`group flex flex-col gap-3 rounded-[22px] border-2 border-slate-200 bg-gradient-to-r ${item.tone} p-4 text-left text-white shadow-lg transition hover:shadow-xl hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${
              isActive ? 'scale-95 ring-2 ring-white/50' : ''
            }`}
          >
            <motion.div
              animate={{ scale: isActive ? 1.2 : 1 }}
              className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/15 backdrop-blur-md transition group-hover:bg-white/20 sm:h-14 sm:w-14"
            >
              <Icon size={22} />
            </motion.div>
            <div>
              <p className="text-[14px] font-black sm:text-[15px]">{item.title}</p>
              <p className="text-[12px] text-white/80">{item.subtitle}</p>
            </div>
            <motion.div
              animate={{ x: isActive ? 4 : 0 }}
              className="ml-auto shrink-0"
            >
              <ChevronRight size={20} className="transition group-hover:translate-x-1" />
            </motion.div>
          </motion.button>
        )
      })}
    </div>
  )
}

function BottomLiveTicker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mt-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-white">Live</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-scroll flex gap-8 whitespace-nowrap">
            {liveTickerItems.map((item, idx) => (
              <span key={idx} className="text-[13px] font-semibold text-white/90">
                {item}
              </span>
            ))}
            {liveTickerItems.map((item, idx) => (
              <span key={`repeat-${idx}`} className="text-[13px] font-semibold text-white/90">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ApprovedCommunityUpdates({ items }) {
  if (!items.length) return null

  return (
    <section className="mb-6 rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">Admin approved</p>
          <h3 className="text-lg font-black text-slate-900">Community uploads live on the home page</h3>
        </div>
        <p className="text-sm font-semibold text-slate-500">{items.length} approved post{items.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400">No image</div>
            )}

            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1">Approved</span>
                {item.category && <span>{item.category}</span>}
                {item.village && <span>{item.village}</span>}
              </div>
              <h4 className="mt-3 text-base font-extrabold text-slate-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="mt-3 text-xs font-semibold text-slate-500">Shared by {item.reporterName || 'Community Contributor'}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default function NewsroomDashboard() {
  const [approvedUploads, setApprovedUploads] = useState([])

  useEffect(() => {
    const syncApprovedUploads = () => {
      setApprovedUploads(getApprovedSubmissions())
    }

    syncApprovedUploads()
    return subscribeToModerationChanges(syncApprovedUploads)
  }, [])

  return (
    <section className="px-2 pt-0 sm:px-3 lg:px-4 pb-6">
      <div className="w-full">
        <ApprovedCommunityUpdates items={approvedUploads} />

        {/* Main Grid: Large Breaking Card + Medium Cards */}
        <div className="grid gap-6 mb-6 grid-cols-1 lg:grid-cols-3">
          {/* Large Breaking Card - spans 2 columns on larger screens */}
          <div className="lg:col-span-2">
            <LargeBreakingCard />
          </div>

          {/* Medium Cards - sidebar */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
            {newsItems.slice(0, 2).map((item, idx) => (
              <NewsCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>

        {/* Secondary News Grid - Masonry Layout */}
        <div className="grid gap-6 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.slice(2).map((item, idx) => (
            <NewsCard key={item.id} item={item} index={idx + 2} />
          ))}
        </div>

        {/* CTA Row */}
        <div className="mb-6">
          <CTARow />
        </div>

        {/* BottomLiveTicker */}
        <BottomLiveTicker />

        {/* Categories / Latest news + Sidebar (two-column) */}
        <section className="mt-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
            {/* Left: Latest news list (spans 8 of 12) */}
            <div className="lg:col-span-8">
              <div className="rounded-[20px] border border-[#e7ece7] bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-black">ताज़ा खबरें</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 sm:justify-end sm:gap-3">
                    <button onClick={() => alert('✅ Showing all latest news')} className="px-3 py-2 rounded-full text-emerald-700 font-semibold border border-emerald-100 bg-emerald-50">सभी</button>
                    <button onClick={() => alert('⭐ Showing popular news')} className="px-3 py-2 rounded-full hover:bg-slate-50">लोकप्रिय</button>
                    <button onClick={() => alert('👀 Showing most read stories')} className="px-3 py-2 rounded-full hover:bg-slate-50">सबसे ज्यादा पढ़ी गई</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {newsItems.map((item, idx) => (
                    <article key={item.id} className="flex flex-col gap-3 rounded-lg border border-transparent p-3 transition hover:border-slate-100 sm:flex-row sm:items-start sm:gap-4">
                      <img src={item.image} alt={item.title} className="h-44 w-full flex-shrink-0 rounded-md object-cover sm:h-24 sm:w-36" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-bold">{item.type === 'farming' ? 'कृषि' : item.type}</span>
                          <span>{item.timestamp}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{item.summary}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          {item.avatar && <img src={item.avatar} alt={item.reporter} className="h-8 w-8 rounded-full object-cover" />}
                          <div>
                            <div className="font-semibold text-slate-800">{item.reporter}</div>
                            <div className="text-xs">{item.village}</div>
                          </div>
                          <div className="ml-auto text-xs text-slate-500">{item.comments} टिप्पणियाँ</div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('📰 Loading more news stories...')}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2 text-white font-bold">और खबरें देखें</motion.button>
                </div>
              </div>
            </div>

            {/* Right: Sidebar (spans 4 of 12) */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-[18px] border border-[#e7ece7] bg-white p-4 shadow-sm">
                <h4 className="font-bold">ज़रूरी सूचनाएँ</h4>
                  <ul className="mt-3 space-y-3 text-sm text-slate-700">
                    {alerts.map((a) => (
                      <li key={a.id} className={`rounded-md p-3 ${a.tone}`}>
                        <div className="font-bold">{a.title}</div>
                        <div className="mt-1 text-sm text-slate-700">{a.summary}</div>
                      </li>
                    ))}
                  </ul>
              </div>

              <div className="rounded-[18px] border border-[#e7ece7] bg-white p-4 shadow-sm">
                <h4 className="font-bold">ट्रेंडिंग टैग्स</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trendingTags.map((t) => (
                    <span key={t} className="px-3 py-2 bg-neutral-100 rounded-full text-sm">{t}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-[#e7ece7] bg-white p-4 shadow-sm">
                <h4 className="font-bold">लोकप्रिय वीडियो</h4>
                <div className="mt-3 relative rounded-md overflow-hidden">
                  <img src={newsItems[0].image} alt="video" className="w-full h-40 object-cover rounded-md" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 text-white px-3 py-2 rounded-full">▶</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">तेज बारिश से शहर में उत्पन्न स्थिति — रिपोर्ट</div>
              </div>
            </aside>
          </div>
        </section>

        {/* Short Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[22px] font-black text-slate-900">Recently Shared Videos</h2>
              <button onClick={() => alert('🎥 Showing all videos...')} className="inline-flex items-center gap-1 self-start text-[13px] font-bold text-emerald-700 hover:text-emerald-800 sm:self-auto">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative h-48 overflow-hidden rounded-[20px] bg-slate-200 shadow-md transition hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <img
                  src={`https://images.unsplash.com/photo-${1500382017468 + idx}?auto=format&fit=crop&w=600&q=80`}
                  alt={`Video ${idx}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
                <button
                  type="button"
                  onClick={() => alert(`🎥 Playing video ${idx}: Farm Life Story`)}
                  className="absolute inset-0 flex items-center justify-center transition group-hover:scale-110"
                >
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition group-hover:bg-white">
                    <PlayCircle size={24} fill="currentColor" />
                  </motion.div>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                  <p className="text-[13px] font-bold line-clamp-2">Village Update: Farm Life</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Live Ticker */}
        <BottomLiveTicker />
      </div>
    </section>
  )
}
