import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Card, Badge, Avatar, HStack, Stack, Text } from '../Layout'
import { animations, scrollReveal } from '../../animations'

// News Card
export const NewsCard = ({ news, onBookmark, onShare, onComment }) => {
  const safeBookmark = onBookmark || (() => window.apnaShowToast?.('Bookmarked'))
  const safeShare = onShare || (() => window.apnaShowToast?.('Shared'))
  const safeComment = onComment || (() => window.apnaShowToast?.('Open comments'))

  return (
    <motion.div {...scrollReveal}>
      <Card>
      <div className="flex gap-3 sm:gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
          {news.image && <img src={news.image} alt="" className="w-full h-full object-cover" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {news.breaking && <Badge variant="breaking" size="sm">Breaking</Badge>}
            {news.trending && <Badge variant="trending" size="sm">Trending</Badge>}
          </div>

          <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-1">{news.title}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-1 mb-2">{news.summary}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className="text-neutral-500">{news.village}</span>
            <span className="text-green-600 font-semibold">{news.category}</span>
          </div>

          {/* Reporter */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar src={news.reporter.avatar} name={news.reporter.name} size="xs" verified={news.reporter.verified} />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{news.reporter.name}</p>
              <p className="text-xs text-neutral-500">{formatTime(news.timestamp)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 text-neutral-600 text-xs">
            <button className="flex items-center gap-1 hover:text-green-600">
              <Heart className="w-4 h-4" />
              {news.likes || 0}
            </button>
            <button onClick={safeComment} className="flex items-center gap-1 hover:text-green-600">
              <Icons.MessageCircle className="w-4 h-4" />
              {news.comments}
            </button>
            <button onClick={safeShare} className="flex items-center gap-1 hover:text-green-600">
              <Icons.Share2 className="w-4 h-4" />
            </button>
            <button onClick={safeBookmark} className="flex items-center gap-1 hover:text-green-600 ml-auto">
              <Icons.Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
  )
}

// Village Card
export const VillageCard = ({ village }) => (
  <motion.div {...scrollReveal}>
    <Card className="relative overflow-hidden h-48 sm:h-56 group">
      <img
        src={village.image}
        alt={village.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{village.name}</h3>
        <p className="text-white/80 text-xs sm:text-sm mb-3">{village.vibe}</p>
        <div className="flex gap-4 text-white text-xs">
          <div>
            <p className="text-white/70 text-xs">Stories</p>
            <p className="font-bold">{village.storiesCount}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Alerts</p>
            <p className="font-bold">{village.alertsCount}</p>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
)

// Marketplace Card
export const MarketplaceCard = ({ item, onContact, onCall }) => {
  const safeContact = onContact || (() => window.apnaShowToast?.('Opening chat with seller'))
  const safeCall = onCall || (() => window.apnaShowToast?.('Calling seller'))

  return (
    <motion.div {...scrollReveal}>
      <Card>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-neutral-200 rounded-t-2xl">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <Badge variant="success" className="absolute top-3 right-3">
          {item.category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-2xl font-bold text-green-600 mb-2">₹{item.price.toLocaleString()}</p>

        {/* Details */}
        <div className="text-xs text-neutral-600 mb-3 space-y-1">
          <p>{item.condition}</p>
          <div className="flex gap-4">
            {item.specs?.map((spec, i) => (
              <p key={i}>{spec}</p>
            ))}
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b">
            <Avatar src={item.seller.avatar} name={item.seller.name} size="sm" verified={item.seller.verified} />
          <div>
            <p className="font-semibold text-sm">{item.seller.name}</p>
            <p className="text-xs text-neutral-500">
              <Icons.MapPin className="w-3 h-3 inline mr-1" />
              {item.location}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
            <button
            onClick={safeContact}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-600 font-semibold hover:bg-green-100 transition"
          >
            <Icons.MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={safeCall}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            <Icons.Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </button>
        </div>
      </div>
    </Card>
  </motion.div>
  )
}

// Mandi Rate Card
export const MandiRateCard = ({ item }) => (
  <motion.div {...scrollReveal}>
    <Card className="p-4">
      <p className="text-xs text-neutral-600 uppercase font-bold mb-1">{item.market}</p>
      <h3 className="text-lg sm:text-xl font-bold mb-3">{item.commodity}</h3>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-neutral-600 mb-1">Current Rate</p>
          <p className="text-3xl font-bold text-green-600">₹{item.rate}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${item.direction === 'up' ? 'bg-red-100' : 'bg-green-100'}`}>
          <TrendingUp
            className={`w-4 h-4 ${item.direction === 'up' ? 'text-red-600' : 'text-green-600'} ${
              item.direction === 'down' ? 'rotate-180' : ''
            }`}
          />
          <span className={`text-sm font-bold ${item.direction === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {item.trend}%
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-600">Updated: {formatTime(item.lastUpdate)}</p>
    </Card>
  </motion.div>
)

// Weather Card
export const WeatherCard = ({ weather }) => (
  <motion.div {...scrollReveal}>
    <Card className="p-4">
      <p className="text-xs text-neutral-600 uppercase font-bold mb-2">{weather.label}</p>
      {weather.alert && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">{weather.alert}</p>
        </div>
      )}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl sm:text-3xl font-bold">{weather.value}</p>
          {weather.unit && <p className="text-xs text-neutral-600 mt-1">{weather.unit}</p>}
        </div>
        {weather.icon && <div className="text-4xl">{weather.icon}</div>}
      </div>
    </Card>
  </motion.div>
)

// Business Card
export const BusinessCard = ({ business }) => (
  <motion.div {...scrollReveal}>
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-base mb-1">{business.name}</h3>
          <Badge variant="info" size="sm">{business.category}</Badge>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm">{business.rating}</span>
          </div>
          <p className="text-xs text-neutral-600">{business.reviews} reviews</p>
        </div>
      </div>

      <p className="text-sm text-neutral-700 mb-3">{business.description}</p>

      <div className="space-y-2 mb-4 text-sm">
        <p className="flex items-center gap-2 text-neutral-700">
          <MapPin className="w-4 h-4 text-green-600" />
          {business.location}
        </p>
        <p className="flex items-center gap-2 text-neutral-700">
          <Phone className="w-4 h-4 text-green-600" />
          {business.phone}
        </p>
      </div>

      <p className="text-xs text-neutral-600 mb-3">{business.hours}</p>

      {business.verified && <Badge variant="verified" size="sm">Verified</Badge>}
    </Card>
  </motion.div>
)

// Event Card
export const EventCard = ({ event }) => (
  <motion.div {...scrollReveal}>
    <Card>
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-neutral-200">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <Badge variant="warning" className="absolute top-3 left-3">{event.category}</Badge>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base mb-2">{event.title}</h3>

        <div className="space-y-2 mb-4 text-sm text-neutral-700">
          <p>📅 {event.date} at {event.time}</p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.attending} attending
          </p>
        </div>

        <button className="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
          Attend Event
        </button>
      </div>
    </Card>
  </motion.div>
)

// Scheme Card
export const SchemeCard = ({ scheme }) => (
  <motion.div {...scrollReveal}>
    <Card className="p-4">
      <Badge variant="success" className="mb-2">{scheme.status}</Badge>
      <h3 className="font-bold text-base sm:text-lg mb-2">{scheme.name}</h3>
      <p className="text-sm text-neutral-700 mb-3">{scheme.description}</p>

      <div className="space-y-2 mb-4 text-sm">
        <p className="flex justify-between">
          <span className="text-neutral-600">Grant Amount:</span>
          <span className="font-bold text-green-600">₹{scheme.amount.toLocaleString()}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-neutral-600">Deadline:</span>
          <span className="font-semibold">{scheme.deadline}</span>
        </p>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
        <p className="text-xs font-semibold text-blue-900 mb-1">Eligibility:</p>
        <p className="text-xs text-blue-800">{scheme.eligibility}</p>
      </div>

      <button className="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
        Learn More
      </button>
    </Card>
  </motion.div>
)

// Farming Advice Card
export const FarmingAdviceCard = ({ advice }) => {
  const severityColors = {
    warning: 'bg-yellow-50 border-yellow-300',
    info: 'bg-blue-50 border-blue-300',
    success: 'bg-green-50 border-green-300'
  }

  return (
    <motion.div {...scrollReveal}>
      <Card className={`p-4 border-l-4 ${severityColors[advice.severity]}`}>
        <h3 className="font-bold text-base mb-1">{advice.title}</h3>
        <p className="text-sm text-neutral-700 mb-3">{advice.description}</p>
        <button className="text-sm font-semibold text-green-600 hover:text-green-700">
          {advice.action} →
        </button>
      </Card>
    </motion.div>
  )
}

// Helper function
const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - new Date(timestamp)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default {
  NewsCard,
  VillageCard,
  MarketplaceCard,
  MandiRateCard,
  WeatherCard,
  BusinessCard,
  EventCard,
  SchemeCard,
  FarmingAdviceCard
}
