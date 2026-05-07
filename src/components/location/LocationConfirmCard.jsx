import { MapPin, CheckCircle2, PencilLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

function LocationConfirmCard({ location, onConfirm, onChange, loading = false, title = 'Detected Location', mobile = false }) {
  if (!location) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${mobile ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <MapPin size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <h3 className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">{location.name}, {location.district}</h3>
          <p className="mt-1 text-sm text-slate-600">{location.tehsil}, {location.state}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">Please confirm your location.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="primary" fullWidth onClick={() => onConfirm(location)} loading={loading}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onChange}>
          <PencilLine className="mr-2 h-4 w-4" /> Change manually
        </Button>
      </div>
    </motion.div>
  )
}

export default LocationConfirmCard