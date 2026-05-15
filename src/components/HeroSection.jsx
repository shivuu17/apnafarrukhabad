import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin } from 'lucide-react'
import { feedData } from '../data/homeData'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'
import { optimizeCloudinaryImageUrl } from '../utils/imageOptimization'
import useWeather from '../hooks/useWeather'
import { getWeatherDisplayIcon } from '../services/weather.service'

export default function HeroSection() {
  const [liveItems, setLiveItems] = useState([])
  const { weather, loading: weatherLoading } = useWeather()

  useEffect(() => {
    let mounted = true

    const loadLiveItems = async () => {
      try {
        const approved = await getApprovedSubmissions()
        if (mounted) setLiveItems(approved || [])
      } catch {
        if (mounted) setLiveItems([])
      }
    }

    loadLiveItems()

    const unsubscribe = subscribeToModerationChanges((state) => {
      if (mounted) setLiveItems(state.approved || [])
    })

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const featured = liveItems[0] || feedData[0]
  const stacked = liveItems.slice(1, 4)
  const featuredImage = optimizeCloudinaryImageUrl(featured?.imageUrl || featured?.image, { width: 1600, height: 900, crop: 'fill' })
  const weatherTemp = typeof weather?.temperature === 'number' ? `${Math.round(weather.temperature)}°` : '--°'
  const weatherDescription = weatherLoading ? 'Loading weather...' : (weather?.description ? String(weather.description).replace(/^./, (ch) => ch.toUpperCase()) : 'Weather unavailable')
  const weatherRain = typeof weather?.rainChance === 'number' ? `${Math.round(weather.rainChance)}%` : '--%'
  const weatherHumidity = typeof weather?.humidity === 'number' ? `${Math.round(weather.humidity)}%` : '--%'
  const weatherIcon = getWeatherDisplayIcon(weather?.description, weather?.conditionCode)

  if (!featured) {
    return (
      <section className="px-3 pt-4 sm:px-4 lg:px-6 pb-3">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Live newsroom</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">No live stories yet</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Publish or approve a report to populate the homepage with current local news.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const handleReadArticle = () => {
    alert(`📖 Opening article: "${featured.title}"`)
  }

  const handleViewForecast = () => {
    alert('🌦️ Opening detailed weather forecast...')
  }

  return (
    <section className="px-3 pt-4 sm:px-4 lg:px-6 pb-3">
      <div className="w-full">
        {/* 3-column grid: 7fr | 3fr | 2fr */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Large Featured Article (7 cols) */}
          <div className="lg:col-span-7">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-[280px] sm:h-[340px] md:h-[380px]">
                <img
                  src={featuredImage}
                  alt={featured.title}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Breaking badge */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3.5 py-1.5 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[12px] font-extrabold uppercase tracking-wider text-white">Breaking</span>
                </div>

                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  {/* Village badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[12px] font-bold shadow-lg">
                    <MapPin size={13} /> {featured.village || 'Farrukhabad'}
                  </div>

                  {/* Headline */}
                  <h2 className="mt-4 text-[24px] font-black leading-[1.2] tracking-tight sm:text-[28px] md:text-[32px]">
                    {featured.title}
                  </h2>

                  {/* Summary */}
                  <p className="mt-3 max-w-[55ch] text-[14px] leading-6 text-white/90">
                    {featured.summary}
                  </p>

                  {/* Footer: Author + Views + CTA */}
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featured.avatar}
                        alt={featured.reporter}
                        className="h-10 w-10 rounded-full object-cover border border-white/20"
                      />
                      <div className="text-sm">
                        <div className="font-bold">{featured.reporterName || featured.reporter || 'Community Contributor'}</div>
                        <div className="text-xs text-white/70">{featured.createdAt ? new Date(featured.createdAt).toLocaleString() : 'Live now'}</div>
                      </div>
                    </div>
                    <motion.button 
                      onClick={handleReadArticle}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700">
                      Read <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* CENTER: 3 Stacked Compact Cards (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {stacked.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex gap-3.5 items-start rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Thumbnail left */}
                <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-[12px] bg-slate-200">
                  <img
                    src={optimizeCloudinaryImageUrl(item.imageUrl || item.image, { width: 480, height: 320, crop: 'fill' })}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content right */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 mb-1">
                    {item.category || 'Update'}
                  </div>
                    <h3 className="text-[14px] font-black leading-[1.3] text-slate-900 line-clamp-2">{item.title}</h3>
                  <div className="mt-1.5 text-xs text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently approved'} · {item.village || 'Farrukhabad'}
                  </div>
                </div>
              </motion.article>
            ))}
              {!stacked.length && (
                <div className="rounded-[18px] border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                  More approved reports will appear here as they are published.
                </div>
              )}
          </div>

          {/* RIGHT: Weather Widget (2 cols) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[18px] bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white shadow-[0_16px_40px_rgba(14,165,233,0.25)] transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Weather Today</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs opacity-80">{weather?.locationName || 'Farrukhabad'}</div>
                  <MapPin size={14} className="opacity-80" />
                </div>
              </div>

              {/* Temperature */}
              <div className="mb-5">
                <div className="text-5xl font-black leading-none flex items-center gap-2">{weatherIcon} {weatherTemp}</div>
                <div className="mt-2 text-sm font-semibold">{weatherDescription}</div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
                <div>
                  <div className="text-sm font-bold">{weatherHumidity}</div>
                  <div className="text-xs opacity-80">Humidity</div>
                </div>
                <div>
                  <div className="text-sm font-bold">{weather?.windSpeed != null ? `${Math.round(weather.windSpeed)} km/h` : '-- km/h'}</div>
                  <div className="text-xs opacity-80">Wind</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-bold">{weatherRain}</div>
                  <div className="text-xs opacity-80">Rain Chance</div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button 
                onClick={handleViewForecast}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full rounded-lg bg-white/15 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25">
                View Forecast →
              </motion.button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}