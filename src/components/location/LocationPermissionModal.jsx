import { LocateFixed, Search } from 'lucide-react'
import { Modal } from '../ui/Modals'
import { Button } from '../ui/Button'

function LocationPermissionModal({ isOpen, onClose, onAllow, onChooseManually, loading = false, error = '' }) {
  const content = (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <LocateFixed size={22} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location access</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">Allow location access to auto-detect your area and improve local news accuracy.</h3>
          <p className="mt-2 text-sm text-slate-600">We only store your village or town level location publicly. Exact house coordinates stay private.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="primary" fullWidth onClick={onAllow} loading={loading}>
          Allow Access
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onChooseManually}>
          <Search className="mr-2 h-4 w-4" /> Choose Manually
        </Button>
      </div>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm your location" size="md">
      {content}
    </Modal>
  )
}

export default LocationPermissionModal