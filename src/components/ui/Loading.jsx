import React from 'react'
import { motion } from 'framer-motion'

// Shimmer animation
const shimmer = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0' },
  transition: { duration: 3, repeat: Infinity, ease: 'linear' }
}

// Skeleton Card
export const SkeletonCard = ({ className = '' }) => (
  <motion.div
    className={`rounded-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] ${className}`}
    {...shimmer}
  />
)

// Skeleton News Card
export const SkeletonNewsCard = () => (
  <div className="border border-neutral-200 rounded-2xl p-4 bg-white animate-pulse">
    <div className="flex gap-4">
      <SkeletonCard className="w-24 h-24 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <SkeletonCard className="h-4 w-20" />
        <SkeletonCard className="h-5 w-full" />
        <SkeletonCard className="h-4 w-3/4" />
        <div className="flex gap-2">
          <SkeletonCard className="h-8 w-20" />
          <SkeletonCard className="h-8 w-16" />
        </div>
      </div>
    </div>
  </div>
)

// Skeleton Marketplace Card
export const SkeletonMarketplaceCard = () => (
  <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white animate-pulse">
    <SkeletonCard className="aspect-video" />
    <div className="p-4 space-y-3">
      <SkeletonCard className="h-5 w-3/4" />
      <SkeletonCard className="h-6 w-1/3" />
      <SkeletonCard className="h-4 w-full" />
      <div className="flex gap-2 pt-2">
        <SkeletonCard className="h-10 flex-1" />
        <SkeletonCard className="h-10 flex-1" />
      </div>
    </div>
  </div>
)

// Skeleton Grid
export const SkeletonGrid = ({ count = 4, cols = 2 }) => (
  <div className={`grid grid-cols-${cols} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} className="aspect-video" />
    ))}
  </div>
)

// Loading Spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`${sizes[size]} border-neutral-300 border-t-green-600 rounded-full animate-spin ${className}`} />
  )
}

// Loading overlay
export const LoadingOverlay = ({ show = true, message = 'Loading...' }) => {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && <p className="text-sm font-semibold text-neutral-800">{message}</p>}
      </div>
    </motion.div>
  )
}

// Pulse badge
export const PulseBadge = ({ children, className = '' }) => (
  <motion.span
    animate={{ opacity: [1, 0.5, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold ${className}`}
  >
    <span className="inline-block w-2 h-2 rounded-full bg-white" />
    {children}
  </motion.span>
)

// Shimmer effect component
export const ShimmerEffect = ({ className = '' }) => (
  <motion.div
    className={`bg-gradient-to-r from-transparent via-white/40 to-transparent ${className}`}
    {...shimmer}
  />
)

// Progress Bar
export const ProgressBar = ({ value = 50, className = '' }) => (
  <div className={`w-full h-2 rounded-full bg-neutral-200 overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-r from-green-500 to-green-600"
    />
  </div>
)

// Skeleton avatar
export const SkeletonAvatar = ({ size = 'md' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  return <SkeletonCard className={`${sizes[size]} rounded-full`} />
}

// Skeleton text (line)
export const SkeletonText = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <SkeletonCard className={`${width} ${height} rounded ${className}`} />
)

// Array of skeleton lines
export const SkeletonTextBlock = ({ lines = 3, gap = 2 }) => (
  <div className={`space-y-${gap}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonText key={i} width={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
)

// Lazy image loader
export const LazyImage = ({ src, alt, aspectRatio = 'aspect-video', onLoad }) => {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <div className={`relative overflow-hidden rounded-lg bg-neutral-200 ${aspectRatio}`}>
      {isLoading && <ShimmerEffect className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}

// Page skeleton (full layout)
export const PageSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="h-16 bg-white border-b border-neutral-200" />

    {/* Hero skeleton */}
    <SkeletonCard className="h-64" />

    {/* Content blocks */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-4">
        <SkeletonText width="w-1/3" height="h-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <SkeletonCard key={j} className="aspect-square" />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default {
  SkeletonCard,
  SkeletonNewsCard,
  SkeletonMarketplaceCard,
  SkeletonGrid,
  Spinner,
  LoadingOverlay,
  PulseBadge,
  ShimmerEffect,
  ProgressBar,
  SkeletonAvatar,
  SkeletonText,
  SkeletonTextBlock,
  LazyImage,
  PageSkeleton
}
