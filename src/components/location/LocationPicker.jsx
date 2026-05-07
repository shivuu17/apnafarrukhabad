import { useMemo } from 'react'
import { Search, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../ui/FormInputs'

function LocationPicker({ query, onQueryChange, options = [], onSelect, label = 'Search your village / town...' }) {
  const filtered = useMemo(() => options.slice(0, 8), [options])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={label}
          className="pl-11"
        />
      </div>

      <AnimatePresence>
        {filtered.length > 0 && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg"
          >
            {filtered.map((item) => (
              <button
                key={`${item.name}-${item.tehsil}-${item.type}`}
                type="button"
                onClick={() => onSelect(item)}
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-emerald-50"
              >
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    [{item.type}] {item.name}
                  </p>
                  <p className="text-sm text-slate-500">{item.district}, {item.state}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LocationPicker