import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import * as feedbackService from '../../services/feedback.service'
import { Modal } from '../../components/ui/Modals'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

export default function AdminFeedback() {
  const [entries, setEntries] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const loadEntries = useCallback(async () => {
    try {
      const state = await feedbackService.getFeedbackState()
      setEntries(state.entries || [])
    } catch (error) {
      console.error('Failed to load feedback entries:', error)
    }
  }, [])

  useEffect(() => {
    loadEntries()

    const handleStorageChange = () => {
      loadEntries()
    }

    const unsubscribe = feedbackService.subscribeToFeedbackChanges((state) => {
      setEntries(state.entries || [])
    })

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (unsubscribe) unsubscribe()
    }
  }, [loadEntries])

  const selectedEntry = useMemo(
    () => entries.find((item) => item.id === selectedId) || null,
    [entries, selectedId],
  )

  const deleteEntry = async (entry) => {
    if (!window.confirm(`Delete feedback from ${entry.name}?`)) return

    try {
      await feedbackService.deleteFeedbackEntry(entry.id)
      await loadEntries()
      if (selectedId === entry.id) {
        setSelectedId(null)
      }
    } catch (error) {
      alert('Failed to delete feedback: ' + error.message)
    }
  }

  return (
    <section className="space-y-6">
      <header className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#0f6a2f]">Feedback</h2>
        <p className="mt-1 text-sm text-slate-500">User feedback submissions collected from the site appear here for review.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total feedback</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{entries.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Recent feedback</p>
          <p className="mt-2 text-3xl font-black text-emerald-800">{entries.slice(0, 5).length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">With ratings</p>
          <p className="mt-2 text-3xl font-black text-amber-800">{entries.filter((entry) => Boolean(entry.rating)).length}</p>
        </div>
      </section>

      <section className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td className="px-3 py-5 text-sm text-slate-500" colSpan={6}>
                    No feedback submitted yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-emerald-100/90">
                    <td className="px-3 py-3 text-slate-600">{formatDate(entry.createdAt)}</td>
                    <td className="px-3 py-3 font-semibold text-slate-900">{entry.name || 'Anonymous'}</td>
                    <td className="px-3 py-3 text-slate-600">{entry.email || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{entry.rating ? `${entry.rating}/5` : '—'}</td>
                    <td className="px-3 py-3 text-slate-600">
                      <p className="max-w-[420px] truncate">{entry.message}</p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(entry.id)}
                          className="admin-clickable rounded-full border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEntry(entry)}
                          className="admin-clickable inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedEntry && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/55 p-4">
          <div className="admin-modal-enter my-8 w-full max-w-2xl rounded-[24px] border border-emerald-100 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Feedback details</p>
                <h3 className="mt-1 text-2xl font-black text-[#0f6a2f]">{selectedEntry.name || 'Anonymous'}</h3>
                <p className="mt-2 text-sm text-slate-600">{formatDate(selectedEntry.createdAt)}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedId(null)}
                className="admin-clickable grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{selectedEntry.email || '—'}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Rating</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{selectedEntry.rating ? `${selectedEntry.rating}/5` : '—'}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-500">Source</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{selectedEntry.pagePath || selectedEntry.source || 'footer-feedback'}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
              <div className="mt-2 rounded-lg border border-emerald-100 bg-[#f7fbf8] p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedEntry.message}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="admin-clickable rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => deleteEntry(selectedEntry)}
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