import { useMemo, useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import * as mediationService from '../../services/mediaModeration.service'
import { Modal } from '../../components/ui/Modals'

export default function AdminNewsRequests() {
  const [requests, setRequests] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [modalMode, setModalMode] = useState('view')

  // Load submissions from mediaModeration service
  const loadRequests = useCallback(async () => {
    try {
      const pending = await mediationService.getPendingSubmissions()
      // Convert submission format to admin panel format
      const formatted = pending.map((submission) => ({
        id: submission.id,
        headline: submission.title,
        category: submission.category || 'News',
        village: submission.village || submission.locationName || 'Unknown',
        author: submission.reporterName || 'Anonymous',
        reporterPhone: submission.phone || '',
        reporterEmail: submission.email || '',
        status: 'pending',
        content: submission.description,
        imageUrl: submission.imageUrl,
        imageName: submission.imageName || '',
      }))
      setRequests(formatted)
    } catch (error) {
      console.error('Failed to load requests:', error)
    }
  }, [])

  // Load on mount and subscribe to storage changes
  useEffect(() => {
    loadRequests()
    
    const handleStorageChange = () => {
      loadRequests()
    }
    
    // Subscribe to Firebase real-time changes
    const unsubscribe = mediationService.subscribeToModerationChanges((state) => {
      if (state.pending) {
        const formatted = state.pending.map((submission) => ({
          id: submission.id,
          headline: submission.title,
          category: submission.category || 'News',
          village: submission.village || submission.locationName || 'Unknown',
          author: submission.reporterName || 'Anonymous',
          reporterPhone: submission.phone || '',
          reporterEmail: submission.email || '',
          status: 'pending',
          content: submission.description,
          imageUrl: submission.imageUrl,
          imageName: submission.imageName || '',
        }))
        setRequests(formatted)
      }
    })
    
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [loadRequests])

  const selectedNews = useMemo(
    () => requests.find((item) => item.id === selectedId) || null,
    [requests, selectedId],
  )

  const openModal = (item, mode) => {
    setSelectedId(item.id)
    setModalMode(mode)
  }

  const closeModal = () => {
    setSelectedId(null)
  }

  const approveNews = async () => {
    if (!selectedNews) return
    try {
      await mediationService.approveSubmission(selectedNews.id, 'Admin')
      await loadRequests()
      closeModal()
    } catch (err) {
      alert('Failed to approve: ' + err.message)
    }
  }

  const rejectNews = async () => {
    if (!selectedNews) return
    try {
      await mediationService.rejectSubmission(selectedNews.id, 'Admin')
      await loadRequests()
      closeModal()
    } catch (err) {
      alert('Failed to reject: ' + err.message)
    }
  }

  const statusClass = (status) => {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200'
    if (status === 'review') return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">News Requests</h2>
        <p className="mt-1 text-sm text-slate-500">View complete news content in popup and approve directly.</p>
      </header>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2">Thumbnail</th>
                <th className="px-3 py-2">Headline</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Village</th>
                <th className="px-3 py-2">Author</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr key={item.id} className="border-t border-emerald-100/90">
                  <td className="px-3 py-3">
                    <div className="h-10 w-16 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-100 to-lime-100" />
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{item.headline}</p>
                    <p className="text-xs text-slate-500">{item.id}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{item.category}</td>
                  <td className="px-3 py-3 text-slate-600">{item.village}</td>
                  <td className="px-3 py-3 text-slate-600">{item.author}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openModal(item, 'view')}
                        className="admin-clickable rounded-full border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal(item, 'approve')}
                        className="admin-clickable rounded-full bg-[#0f6a2f] px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal(item, 'reject')}
                        className="admin-clickable rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-4 overflow-y-auto">
          <div className="admin-modal-enter w-full max-w-3xl rounded-[24px] border border-emerald-100 bg-white p-5 shadow-2xl my-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Full News Submission</p>
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
              {modalMode === 'approve' && (
                <button
                  type="button"
                  onClick={approveNews}
                  className="admin-clickable rounded-full bg-[#0f6a2f] px-4 py-2 text-sm font-semibold text-white"
                >
                  Approve This News
                </button>
              )}
              {modalMode === 'reject' && (
                <button
                  type="button"
                  onClick={rejectNews}
                  className="admin-clickable rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Reject This News
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}