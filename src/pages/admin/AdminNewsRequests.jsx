import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

const initialRequests = [
  {
    id: 'P-8712',
    headline: 'Canal road repair enters final phase',
    category: 'Infrastructure',
    village: 'Rajepur',
    author: 'Ravi Tiwari',
    status: 'pending',
    content: 'District engineers confirmed phase three work has started across the canal belt. Local residents reported improved traffic movement and safer access for school vans. Final inspection is expected by late evening if weather remains clear.',
  },
  {
    id: 'P-8711',
    headline: 'Night market expands before festival week',
    category: 'Business',
    village: 'Kaimganj',
    author: 'Ayesha Khan',
    status: 'review',
    content: 'Traders associations and police teams agreed on extended market timings. Temporary parking bays and emergency lanes are being marked today. Shop owners expect higher evening footfall through the week.',
  },
  {
    id: 'P-8709',
    headline: 'Crop insurance camp draws large turnout',
    category: 'Agriculture',
    village: 'Shamsabad',
    author: 'Prateek Yadav',
    status: 'approved',
    content: 'Farmers from nearby villages participated in a one-day insurance registration drive. Officials said claim awareness has improved and missing-document requests fell this cycle. Follow-up verification camps are planned next week.',
  },
]

export default function AdminNewsRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedId, setSelectedId] = useState(null)
  const [modalMode, setModalMode] = useState('view')

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

  const approveNews = () => {
    if (!selectedNews) return
    setRequests((current) => current.map((item) => (
      item.id === selectedNews.id ? { ...item, status: 'approved' } : item
    )))
    closeModal()
  }

  const statusClass = (status) => {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-4">
          <div className="admin-modal-enter w-full max-w-2xl rounded-[24px] border border-emerald-100 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Full News Content</p>
                <h3 className="mt-1 text-xl font-black text-[#0f6a2f]">{selectedNews.headline}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedNews.category} • {selectedNews.village} • {selectedNews.author}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
                className="admin-clickable grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-[#f7fbf8] p-4">
              <p className="text-sm leading-7 text-slate-700">{selectedNews.content}</p>
            </div>

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
            </div>
          </div>
        </div>
      )}
    </section>
  )
}