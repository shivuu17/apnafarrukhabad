import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import * as mediationService from '../../services/mediaModeration.service'

export default function AdminPublishedNews() {
  const [approvedPosts, setApprovedPosts] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const formatSubmission = (submission) => ({
    id: submission.id,
    headline: submission.title,
    category: submission.category || 'News',
    village: submission.village || submission.locationName || 'Unknown',
    author: submission.reporterName || 'Anonymous',
    reporterPhone: submission.phone || '',
    reporterEmail: submission.email || '',
    status: 'approved',
    content: submission.description,
    imageUrl: submission.imageUrl,
    imageName: submission.imageName || '',
  })

  const loadApproved = useCallback(async () => {
    try {
      const state = await mediationService.getModerationState()
      setApprovedPosts((state.approved || []).map((submission) => formatSubmission(submission)))
    } catch (error) {
      console.error('Failed to load approved posts:', error)
    }
  }, [])

  useEffect(() => {
    loadApproved()

    const handleStorageChange = () => {
      loadApproved()
    }

    const unsubscribe = mediationService.subscribeToModerationChanges((state) => {
      setApprovedPosts((state.approved || []).map((submission) => formatSubmission(submission)))
    })

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (unsubscribe) unsubscribe()
    }
  }, [loadApproved])

  const selectedNews = useMemo(
    () => approvedPosts.find((p) => p.id === selectedId) || null,
    [approvedPosts, selectedId],
  )

  const openModal = (item) => setSelectedId(item.id)
  const closeModal = () => setSelectedId(null)

  const deleteNews = async (item) => {
    if (!window.confirm(`Delete "${item.headline}" permanently?`)) return
    try {
      await mediationService.deleteSubmission(item.id)
      await loadApproved()
      if (selectedId === item.id) closeModal()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Published News</h2>
        <p className="mt-1 text-sm text-slate-500">Delete any already posted story from the live feed.</p>
      </header>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#0f6a2f]">Published News</h3>
            <p className="mt-1 text-sm text-slate-500">Delete any already posted story from the live feed.</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {approvedPosts.length} posts
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {approvedPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No published news found.
            </div>
          ) : (
            approvedPosts.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.headline}</p>
                  <p className="text-xs text-slate-500">{item.category} • {item.village} • {item.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openModal(item)}
                    className="admin-clickable rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNews(item)}
                    className="admin-clickable inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-4 overflow-y-auto">
          <div className="admin-modal-enter w-full max-w-3xl rounded-[24px] border border-emerald-100 bg-white p-5 shadow-2xl my-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Published Story</p>
                <h3 className="mt-1 text-2xl font-black text-[#0f6a2f]">{selectedNews.headline}</h3>
                <p className="mt-2 text-sm text-slate-600">ID: {selectedNews.id}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
                className="admin-clickable grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedNews.category}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Village</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedNews.village}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Reporter</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedNews.author}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                <p className="mt-1 text-sm font-semibold capitalize text-emerald-700">{selectedNews.status}</p>
              </div>
            </div>

            {selectedNews.imageUrl && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image</p>
                <div className="mt-2 rounded-lg overflow-hidden border border-emerald-100 bg-slate-50">
                  <img 
                    src={selectedNews.imageUrl} 
                    alt="Submission image"
                    className="w-full h-auto max-h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1500595046891-dfd73e17aef9?w=500&h=400&fit=crop'
                    }}
                  />
                </div>
                {selectedNews.imageName && (
                  <p className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold">Filename:</span> {selectedNews.imageName}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Description</p>
              <div className="mt-2 rounded-lg border border-emerald-100 bg-[#f7fbf8] p-4">
                <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{selectedNews.content}</p>
              </div>
            </div>

            {selectedNews.reporterPhone && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Reporter Details</p>
                <div className="grid gap-2 text-sm">
                  <p><span className="font-semibold text-slate-600">Phone:</span> <span className="text-slate-900">{selectedNews.reporterPhone}</span></p>
                  {selectedNews.reporterEmail && <p><span className="font-semibold text-slate-600">Email:</span> <span className="text-slate-900 break-all">{selectedNews.reporterEmail}</span></p>}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="admin-clickable rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => deleteNews(selectedNews)}
                className="admin-clickable inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
