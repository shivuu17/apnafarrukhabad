import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getApprovedSubmissions, subscribeToModerationChanges } from '../services/mediaModeration.service'
import CommonPageShell from '../components/CommonPageShell'
import ImageWithFallback from '../components/ImageWithFallback'
import { getCategoryDisplay, normalizeCategory } from '../utils/categoryUtils'

function CategoryTopic() {
  const { slug } = useParams()

  const [newsItems, setNewsItems] = useState([])

  useEffect(() => {
    let mounted = true

    const loadNews = async () => {
      try {
        const approved = await getApprovedSubmissions()
        if (mounted) setNewsItems(approved || [])
      } catch {
        if (mounted) setNewsItems([])
      }
    }

    loadNews()

    const unsubscribe = subscribeToModerationChanges((state) => {
      if (mounted) setNewsItems(state.approved || [])
    })

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const category = getCategoryDisplay(slug)
  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => normalizeCategory(item.category) === normalizeCategory(slug))
  }, [newsItems, slug])

  return (
    <CommonPageShell title={category.title} subtitle={category.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-soft">
            <p className="text-sm font-semibold text-slate-700">No approved news found in this category yet.</p>
            <p className="mt-1 text-xs text-slate-500">Published reports will show up here after admin approval.</p>
          </div>
        ) : filteredItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            {item.imageUrl ? (
              <ImageWithFallback src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" />
            ) : (
              <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-slate-400">No image</div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                  {category.title}
                </span>
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently approved'}</span>
              </div>
              <h3 className="mt-2 text-sm font-extrabold leading-6 text-slate-900">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </CommonPageShell>
  )
}

export default CategoryTopic
