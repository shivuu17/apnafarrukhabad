import { useState } from 'react'

// Simple image component that falls back to an inline SVG if the external image fails to load.
export default function ImageWithFallback({ src, alt = '', className = '', style }) {
  // If the source is an external placeholder that may be blocked, avoid requesting it
  const isBlockedPlaceholder = typeof src === 'string' && src.includes('via.placeholder.com')
  const [imgSrc, setImgSrc] = useState(isBlockedPlaceholder ? null : src)

  const fallbackSvg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'>
      <rect width='100%' height='100%' fill='#f8fafc'/>
      <rect x='8' y='8' width='384' height='234' rx='8' fill='#ffffff' stroke='#e6eef0' />
      <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-family='Arial, Helvetica, sans-serif' font-size='18'>Image unavailable</text>
    </svg>
  `)

  const fallback = `data:image/svg+xml;utf8,${fallbackSvg}`

  const initialSrc = imgSrc || fallback

  return (
    <img
      src={initialSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (initialSrc !== fallback) setImgSrc(fallback)
      }}
      loading="lazy"
    />
  )
}
