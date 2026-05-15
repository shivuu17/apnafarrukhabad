import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Share2,
} from 'lucide-react'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'
import { optimizeCloudinaryImageUrl } from '../utils/imageOptimization'
import { Modal } from './ui/Modals'

function buildInitials(name = '') {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return 'AF'

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function ReporterAvatar({ name, src }) {
  const initials = buildInitials(name)

  if (src) {
    return (
      <img
        src={optimizeCloudinaryImageUrl(src, { width: 128, height: 128, crop: 'fill' })}
        alt={name || 'Reporter'}
        loading="lazy"
        decoding="async"
        className="h-11 w-11 rounded-full border border-emerald-100 object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-black text-white">
      {initials}
    </div>
  )
}

function ApprovedCommunityUpdates({ items }) {
  const [selectedItem, setSelectedItem] = useState(null)

  const selectedImage = useMemo(() => {
    if (!selectedItem) return ''
    return optimizeCloudinaryImageUrl(selectedItem.imageUrl, { width: 1400, height: 900, crop: 'fill' })
  }, [selectedItem])

  if (!items.length) return null

  const handleShare = async (item) => {
    const shareText = `${item.title}\n\n${item.description}\n\nShared from ApnaFarrukhabad`
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
            role="button"
            tabIndex={0}
            onClick={() => setSelectedItem(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSelectedItem(item)
              }
            }}
            className="group overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="relative">
              {item.imageUrl ? (
                <img
                  src={optimizeCloudinaryImageUrl(item.imageUrl, { width: 800, height: 520, crop: 'fill' })}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400">No image</div>
              )}

              <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 shadow-sm">
                Admin approved
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ReporterAvatar name={item.reporterName} src={item.avatar} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">{item.reporterName || 'Community Contributor'}</p>
                    <p className="truncate text-xs text-slate-500">{item.village || 'Farrukhabad'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                {item.category && <span>{item.category}</span>}
                {item.village && <span>{item.village}</span>}
              </div>

              <h4 className="mt-3 text-base font-extrabold text-slate-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Tap to view full details</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleShare(item)
                    }}
                    className="rounded-full p-2 transition hover:bg-slate-100 text-slate-600 hover:text-emerald-700"
                    title="Share this news"
                    type="button"
                  >
                    <Share2 size={16} />
                  </button>
                  <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <Modal isOpen={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} title={selectedItem?.title || 'News details'} size="full">
        {selectedItem && (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              {selectedImage ? (
                <img src={selectedImage} alt={selectedItem.title} className="max-h-[420px] w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center text-slate-400">No image available</div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">Admin approved</span>
              {selectedItem.category && <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{selectedItem.category}</span>}
              {selectedItem.village && <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{selectedItem.village}</span>}
            </div>

            <div className="flex items-center gap-3">
              <ReporterAvatar name={selectedItem.reporterName} src={selectedItem.avatar} />
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedItem.reporterName || 'Community Contributor'}</p>
                <p className="text-xs text-slate-500">{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'Recently approved'}</p>
              </div>
            </div>

            <p className="text-base leading-7 text-slate-700 whitespace-pre-line">{selectedItem.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">This news card opens a full detail view with the original image and description.</p>
              <button
                type="button"
                onClick={() => handleShare(selectedItem)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default function NewsroomDashboard() {
  const [approvedUploads, setApprovedUploads] = useState([])

  useEffect(() => {
    // Load approved submissions on mount
    const loadApprovedUploads = async () => {
      try {
        const approved = await getApprovedSubmissions()
        setApprovedUploads(approved)
      } catch (error) {
        console.error('Failed to load approved submissions:', error)
      }
    }

    loadApprovedUploads()
    
    // Subscribe to real-time changes
    const unsubscribe = subscribeToModerationChanges((state) => {
      if (state.approved) {
        setApprovedUploads(state.approved)
      }
    })
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return (
    <section className="px-2 pt-0 sm:px-3 lg:px-4 pb-6">
      <div className="w-full space-y-6">
        <ApprovedCommunityUpdates items={approvedUploads} />

        <div className="rounded-[22px] border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Add more live modules, or connect categories, alerts, and village data from your backend.
        </div>
      </div>
    </section>
  )
}
