import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AtSign,
  Building2,
  Check,
  CheckCircle2,
  Edit2,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  X,
  XCircle,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import useAuth from '../hooks/useAuth'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

function Profile() {
  const { user, updateProfile, checkUsernameAvailability } = useAuth()

  const initialLocation = user?.locationName
    ? {
        name: user.locationName,
        type: user.locationType || 'Village',
        district: user.district || 'Farrukhabad',
        tehsil: user.tehsil || user.district || 'Farrukhabad',
        state: user.state || 'Uttar Pradesh',
        lat: user.lat ?? null,
        lng: user.lng ?? null,
      }
    : null

  const {
    location,
    confirmLocation,
    detectLocation,
    isDetecting,
    error: locationError,
    searchQuery,
    setSearchQuery,
    matchingLocations,
  } = useLocation(initialLocation)

  const [editing, setEditing] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    village: user?.village || initialLocation?.name || '',
    block: user?.block || '',
    district: user?.district || initialLocation?.district || 'Farrukhabad',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
  })

  const emailVerified = Boolean(user?.emailVerified)
  const phoneVerified = Boolean(user?.phoneVerified)

  const details = [
    { key: 'name', label: 'Full Name', value: user?.name || '', placeholder: 'Enter your full name', icon: UserCircle2 },
    { key: 'email', label: 'Email Address', value: user?.email || '', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Mobile Number', value: user?.phone || '', placeholder: 'Enter mobile number', icon: Phone },
    { key: 'username', label: 'Username', value: user?.username ? `@${String(user.username).replace(/^@/, '')}` : '', placeholder: '@ravikumar', icon: AtSign },
    { key: 'village', label: 'Village', value: user?.village || '', placeholder: 'Select your village', icon: MapPin },
    { key: 'block', label: 'Block / Area', value: user?.block || '', placeholder: 'Optional', icon: Building2 },
    { key: 'district', label: 'District', value: user?.district || 'Farrukhabad', placeholder: 'Farrukhabad', icon: MapPin },
  ]

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
      village: user?.village || initialLocation?.name || '',
      block: user?.block || '',
      district: user?.district || initialLocation?.district || 'Farrukhabad',
      bio: user?.bio || '',
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    })
  }, [user, initialLocation])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) setShowPermissionModal(false)
  }, [location])

  useEffect(() => {
    if (!editing) return

    const normalized = String(form.username || '').trim().replace(/^@/, '').toLowerCase()
    const current = String(user?.username || '').trim().replace(/^@/, '').toLowerCase()

    if (!normalized || normalized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    if (normalized === current) {
      setUsernameStatus('available')
      return
    }

    setUsernameStatus('checking')
    const timer = window.setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(normalized)
        setUsernameStatus(available ? 'available' : 'taken')
      } catch {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [editing, form.username, user?.username, checkUsernameAvailability])

  const handleChange = (key, value) => setForm((state) => ({ ...state, [key]: value }))

  const saveChanges = async () => {
    if (usernameStatus === 'checking') {
      alert('Please wait while username availability is being checked')
      return
    }

    if (usernameStatus === 'taken') {
      alert('Username is already taken')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        username: String(form.username || '').replace(/^@/, ''),
        village: form.village,
        block: form.block,
        district: form.district || 'Farrukhabad',
        bio: form.bio,
        interests: String(form.interests || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', error)
      alert(error?.message || 'Failed to save')
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch {
      // Manual choice stays available through the popup.
    }
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setShowLocationPicker(false)
  }

  const handleSaveLocation = async () => {
    if (!location) return

    try {
      await updateProfile({
        village: location.name,
        locationName: location.name,
        locationType: location.type,
        district: location.district,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
      })
      alert('Location updated')
      setShowLocationPicker(false)
    } catch (error) {
      alert(error?.message || 'Failed to update location')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8f4]">
      <Header scrolled={false} />

      <main className="flex-1 px-3 pb-10 pt-6 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title="My Profile" subtitle="View your account details" />

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="flex items-start justify-between border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
              </div>

              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={saveChanges}>
                    <Check className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
              {details.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon size={14} /> {item.label}
                    </p>

                    {!editing ? (
                      <p className={`mt-2 break-all text-base font-semibold ${item.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.value || item.placeholder}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={form[item.key] || ''}
                          placeholder={item.placeholder}
                          onChange={(event) => handleChange(item.key, event.target.value)}
                          disabled={item.key === 'district'}
                          error={item.key === 'username' && usernameStatus === 'taken' ? 'Username is already taken' : ''}
                        />

                        {item.key === 'username' && (
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            {usernameStatus === 'checking' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="text-slate-500">Checking username...</span>
                              </>
                            )}
                            {usernameStatus === 'available' && (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-700">Username is available</span>
                              </>
                            )}
                            {usernameStatus === 'taken' && (
                              <>
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-700">Username is not available</span>
                              </>
                            )}
                            {usernameStatus === 'error' && <span className="text-slate-500">Could not check availability right now</span>}
                            {usernameStatus === 'idle' && <span className="text-slate-500">example: @ravikumar</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Info size={14} /> Bio
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>
                    {user?.bio || 'Tell us about yourself...'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <TextArea
                      value={form.bio}
                      onChange={(event) => handleChange('bio', event.target.value)}
                      placeholder="Sharing local updates from my village."
                      maxLength={160}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AtSign size={14} /> Interests
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>
                    {Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <Input
                      value={form.interests}
                      onChange={(event) => handleChange('interests', event.target.value)}
                      placeholder="Local News, Farming, Education"
                      helperText="Add comma separated interests"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${phoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {phoneVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">
                          Verify mobile
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {emailVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">
                          Verify email
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {(!phoneVerified || !emailVerified) && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-700">
                    <ShieldAlert size={14} /> Complete pending verification to increase trust and reach.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  {location ? buildDisplayName(location) : 'Set your location'}
                </h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                Change
              </Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? (
                <LocationConfirmCard
                  location={location}
                  onConfirm={handleSaveLocation}
                  onChange={() => setShowLocationPicker(true)}
                  loading={isDetecting}
                  mobile={isMobile}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Tap Change or allow access when prompted.
                </div>
              )}

              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>
        </div>
      </main>

      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handleAllowLocation}
        onChooseManually={handleChooseLocationManually}
        loading={isDetecting}
        error={locationError}
      />

      {showLocationPicker && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location">
              <LocationPicker query={searchQuery} onQueryChange={setSearchQuery} options={matchingLocations} onSelect={handleSelectLocation} />
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <LocationPicker query={searchQuery} onQueryChange={setSearchQuery} options={matchingLocations} onSelect={handleSelectLocation} />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}

export default Profileimport { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, UserCircle2, Edit2, Check, X, Phone, AtSign, MapPin, Building2, ShieldAlert, ShieldCheck, Info, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import useAuth from '../hooks/useAuth'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

export default function Profile() {
  const { user, updateProfile, checkUsernameAvailability } = useAuth()

  const initialLocation = user?.locationName
    ? {
        name: user.locationName,
        type: user.locationType || 'Village',
        district: user.district || 'Farrukhabad',
        tehsil: user.tehsil || user.district || 'Farrukhabad',
        state: user.state || 'Uttar Pradesh',
        lat: user.lat ?? null,
        lng: user.lng ?? null,
      }
    : null

  const {
    location,
    confirmLocation,
    detectLocation,
    isDetecting,
    error: locationError,
    searchQuery,
    setSearchQuery,
    matchingLocations,
  } = useLocation(initialLocation)

  const [editing, setEditing] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    village: user?.village || initialLocation?.name || '',
    block: user?.block || '',
    district: user?.district || initialLocation?.district || 'Farrukhabad',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
  })

  const details = [
    { key: 'name', label: 'Full Name', value: user?.name || '', placeholder: 'Enter your full name', icon: UserCircle2 },
    { key: 'email', label: 'Email Address', value: user?.email || '', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Mobile Number', value: user?.phone || '', placeholder: 'Enter mobile number', icon: Phone },
    { key: 'username', label: 'Username', value: user?.username ? `@${String(user.username).replace(/^@/, '')}` : '', placeholder: '@ravikumar', icon: AtSign },
    { key: 'village', label: 'Village', value: user?.village || '', placeholder: 'Select your village', icon: MapPin },
    { key: 'block', label: 'Block / Area', value: user?.block || '', placeholder: 'Optional', icon: Building2 },
    { key: 'district', label: 'District', value: user?.district || 'Farrukhabad', placeholder: 'Farrukhabad', icon: MapPin },
  ]

  const emailVerified = Boolean(user?.emailVerified)
  const phoneVerified = Boolean(user?.phoneVerified)

  useEffect(() => {
    const next = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
      village: user?.village || initialLocation?.name || '',
      block: user?.block || '',
      district: user?.district || initialLocation?.district || 'Farrukhabad',
      bio: user?.bio || '',
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    }
    setForm(next)
  }, [user, initialLocation])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) setShowPermissionModal(false)
  }, [location])

  useEffect(() => {
    if (!editing) return

    const normalized = String(form.username || '').trim().replace(/^@/, '').toLowerCase()
    const current = String(user?.username || '').trim().replace(/^@/, '').toLowerCase()

    if (!normalized || normalized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    if (normalized === current) {
      setUsernameStatus('available')
      return
    }

    setUsernameStatus('checking')
    const timer = window.setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(normalized)
        setUsernameStatus(isAvailable ? 'available' : 'taken')
      } catch {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [editing, form.username, user?.username, checkUsernameAvailability])

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const saveChanges = async () => {
    if (usernameStatus === 'checking') {
      alert('Please wait while username availability is being checked')
      return
    }
    if (usernameStatus === 'taken') {
      alert('Username is already taken')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        username: String(form.username || '').replace(/^@/, ''),
        village: form.village,
        block: form.block,
        district: form.district || 'Farrukhabad',
        bio: form.bio,
        interests: String(form.interests || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', err)
      alert(err.message || 'Failed to save')
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch {
      // fallback is manual selection
    }
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setShowLocationPicker(false)
  }

  const handleSaveLocation = async () => {
    if (!location) return
    try {
      await updateProfile({
        village: location.name,
        locationName: location.name,
        locationType: location.type,
        district: location.district,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
      })
      alert('Location updated')
      setShowLocationPicker(false)
    } catch (err) {
      alert(err.message || 'Failed to update location')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4] flex flex-col">
      <Header scrolled={false} />
      <main className="flex-1 px-3 pt-6 pb-10 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title="My Profile" subtitle="View your account details" />

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
              </div>
              <div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={saveChanges}>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
              {details.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon size={14} /> {item.label}
                    </p>
                    {!editing ? (
                      <p className={`mt-2 break-all text-base font-semibold ${item.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.value || item.placeholder}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={form[item.key] || ''}
                          placeholder={item.placeholder}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          disabled={item.key === 'district'}
                          error={item.key === 'username' && usernameStatus === 'taken' ? 'Username is already taken' : ''}
                        />
                        {item.key === 'username' && (
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            {usernameStatus === 'checking' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="text-slate-500">Checking username...</span>
                              </>
                            )}
                            {usernameStatus === 'available' && (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-700">Username is available</span>
                              </>
                            )}
                            {usernameStatus === 'taken' && (
                              <>
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-700">Username is not available</span>
                              </>
                            )}
                            {usernameStatus === 'error' && <span className="text-slate-500">Could not check availability right now</span>}
                            {usernameStatus === 'idle' && <span className="text-slate-500">example: @ravikumar</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Info size={14} /> Bio
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>{user?.bio || 'Tell us about yourself...'}</p>
                ) : (
                  <div className="mt-2">
                    <TextArea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Sharing local updates from my village."
                      maxLength={160}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AtSign size={14} /> Interests
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>
                    {Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <Input
                      value={form.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      placeholder="Local News, Farming, Education"
                      helperText="Add comma separated interests"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${phoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}>{phoneVerified ? 'Verified' : 'Pending verification'}</p>
                      {phoneVerified ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span> : <Button type="button" size="xs" variant="outline">Verify mobile</Button>}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>{emailVerified ? 'Verified' : 'Pending verification'}</p>
                      {emailVerified ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span> : <Button type="button" size="xs" variant="outline">Verify email</Button>}
                    </div>
                  </div>
                </div>

                {(!phoneVerified || !emailVerified) && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs text-amber-700 font-semibold">
                    <ShieldAlert size={14} /> Complete pending verification to increase trust and reach.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Set your location'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>Change</Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? (
                <LocationConfirmCard location={location} onConfirm={handleSaveLocation} onChange={() => setShowLocationPicker(true)} loading={isDetecting} mobile={isMobile} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Tap Change or allow access when prompted.
                </div>
              )}
              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>
        </div>
      </main>
      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handleAllowLocation}
        onChooseManually={handleChooseLocationManually}
        loading={isDetecting}
        error={locationError}
      />

      {showLocationPicker && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location">
              <LocationPicker query={searchQuery} onQueryChange={setSearchQuery} options={matchingLocations} onSelect={handleSelectLocation} />
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <LocationPicker query={searchQuery} onQueryChange={setSearchQuery} options={matchingLocations} onSelect={handleSelectLocation} />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, UserCircle2, Edit2, Check, X, Phone, AtSign, MapPin, Building2, ShieldAlert, ShieldCheck, Info, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import useAuth from '../hooks/useAuth'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

export default function Profile() {
  const { user, updateProfile, checkUsernameAvailability } = useAuth()

  const initialLocation = user?.locationName
    ? {
        name: user.locationName,
        type: user.locationType || 'Village',
        district: user.district || 'Farrukhabad',
        tehsil: user.tehsil || user.district || 'Farrukhabad',
        state: user.state || 'Uttar Pradesh',
        lat: user.lat ?? null,
        lng: user.lng ?? null,
      }
    : null

  const {
    location,
    confirmLocation,
    detectLocation,
    isDetecting,
    error: locationError,
    searchQuery,
    setSearchQuery,
    matchingLocations,
  } = useLocation(initialLocation)

  const [editing, setEditing] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    village: user?.village || initialLocation?.name || '',
    block: user?.block || '',
    district: user?.district || initialLocation?.district || 'Farrukhabad',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
  })

  const details = [
    { key: 'name', label: 'Full Name', value: user?.name || '', placeholder: 'Enter your full name', icon: UserCircle2 },
    { key: 'email', label: 'Email Address', value: user?.email || '', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Mobile Number', value: user?.phone || '', placeholder: 'Enter mobile number', icon: Phone },
    { key: 'username', label: 'Username', value: user?.username ? `@${String(user.username).replace(/^@/, '')}` : '', placeholder: '@ravikumar', icon: AtSign },
    { key: 'village', label: 'Village', value: user?.village || '', placeholder: 'Select your village', icon: MapPin },
    { key: 'block', label: 'Block / Area', value: user?.block || '', placeholder: 'Optional', icon: Building2 },
    { key: 'district', label: 'District', value: user?.district || 'Farrukhabad', placeholder: 'Farrukhabad', icon: MapPin },
  ]

  const emailVerified = Boolean(user?.emailVerified)
  const phoneVerified = Boolean(user?.phoneVerified)

  useEffect(() => {
    const next = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
      village: user?.village || initialLocation?.name || '',
      block: user?.block || '',
      district: user?.district || initialLocation?.district || 'Farrukhabad',
      bio: user?.bio || '',
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    }
    setForm(next)
  }, [user, initialLocation])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) setShowPermissionModal(false)
  }, [location])

  useEffect(() => {
    if (!editing) return

    const normalized = String(form.username || '').trim().replace(/^@/, '').toLowerCase()
    const current = String(user?.username || '').trim().replace(/^@/, '').toLowerCase()

    if (!normalized || normalized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    if (normalized === current) {
      setUsernameStatus('available')
      return
    }

    setUsernameStatus('checking')
    const timer = window.setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(normalized)
        setUsernameStatus(isAvailable ? 'available' : 'taken')
      } catch {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [editing, form.username, user?.username, checkUsernameAvailability])

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const saveChanges = async () => {
    if (usernameStatus === 'checking') {
      alert('Please wait while username availability is being checked')
      return
    }
    if (usernameStatus === 'taken') {
      alert('Username is already taken')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        username: String(form.username || '').replace(/^@/, ''),
        village: form.village,
        block: form.block,
        district: form.district || 'Farrukhabad',
        bio: form.bio,
        interests: String(form.interests || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', err)
      alert(err.message || 'Failed to save')
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch {
      // fallback is manual selection
    }
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setShowLocationPicker(false)
  }

  const handleSaveLocation = async () => {
    if (!location) return
    try {
      await updateProfile({
        village: location.name,
        locationName: location.name,
        locationType: location.type,
        district: location.district,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
      })
      alert('Location updated')
      setShowLocationPicker(false)
    } catch (err) {
      alert(err.message || 'Failed to update location')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4] flex flex-col">
      <Header scrolled={false} />
      <main className="flex-1 px-3 pt-6 pb-10 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title="My Profile" subtitle="View your account details" />

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
              </div>
              <div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={saveChanges}>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
              {details.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon size={14} /> {item.label}
                    </p>
                    {!editing ? (
                      <p className={`mt-2 break-all text-base font-semibold ${item.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.value || item.placeholder}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={form[item.key] || ''}
                          placeholder={item.placeholder}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          disabled={item.key === 'district'}
                          error={item.key === 'username' && usernameStatus === 'taken' ? 'Username is already taken' : ''}
                        />
                        {item.key === 'username' && (
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            {usernameStatus === 'checking' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="text-slate-500">Checking username...</span>
                              </>
                            )}
                            {usernameStatus === 'available' && (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-700">Username is available</span>
                              </>
                            )}
                            {usernameStatus === 'taken' && (
                              <>
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-700">Username is not available</span>
                              </>
                            )}
                            {usernameStatus === 'error' && <span className="text-slate-500">Could not check availability right now</span>}
                            {usernameStatus === 'idle' && <span className="text-slate-500">example: @ravikumar</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Info size={14} /> Bio
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>
                    {user?.bio || 'Tell us about yourself...'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <TextArea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Sharing local updates from my village."
                      maxLength={160}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AtSign size={14} /> Interests
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>
                    {Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <Input
                      value={form.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      placeholder="Local News, Farming, Education"
                      helperText="Add comma separated interests"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${phoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {phoneVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify mobile</Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {emailVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify email</Button>
                      )}
                    </div>
                  </div>
                </div>

                {(!phoneVerified || !emailVerified) && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs text-amber-700 font-semibold">
                    <ShieldAlert size={14} /> Complete pending verification to increase trust and reach.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Set your location'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                Change
              </Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? (
                <LocationConfirmCard
                  location={location}
                  onConfirm={handleSaveLocation}
                  onChange={() => setShowLocationPicker(true)}
                  loading={isDetecting}
                  mobile={isMobile}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Tap Change or allow access when prompted.
                </div>
              )}
              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>
        </div>
      </main>
      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handleAllowLocation}
        onChooseManually={handleChooseLocationManually}
        loading={isDetecting}
        error={locationError}
      />

      {showLocationPicker && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, UserCircle2, Edit2, Check, X, Phone, AtSign, MapPin, Building2, ShieldAlert, ShieldCheck, Info, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import useAuth from '../hooks/useAuth'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

export default function Profile() {
  const { user, updateProfile, checkUsernameAvailability } = useAuth()

  const initialLocation = user?.locationName
    ? {
        name: user.locationName,
        type: user.locationType || 'Village',
        district: user.district || 'Farrukhabad',
        tehsil: user.tehsil || user.district || 'Farrukhabad',
        state: user.state || 'Uttar Pradesh',
        lat: user.lat ?? null,
        lng: user.lng ?? null,
      }
    : null

  const {
    location,
    confirmLocation,
    detectLocation,
    isDetecting,
    error: locationError,
    searchQuery,
    setSearchQuery,
    matchingLocations,
  } = useLocation(initialLocation)

  const [editing, setEditing] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    village: user?.village || initialLocation?.name || '',
    block: user?.block || '',
    district: user?.district || initialLocation?.district || 'Farrukhabad',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
  })

  const details = [
    { key: 'name', label: 'Full Name', value: user?.name || '', placeholder: 'Enter your full name', icon: UserCircle2 },
    { key: 'email', label: 'Email Address', value: user?.email || '', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Mobile Number', value: user?.phone || '', placeholder: 'Enter mobile number', icon: Phone },
    { key: 'username', label: 'Username', value: user?.username ? `@${String(user.username).replace(/^@/, '')}` : '', placeholder: '@ravikumar', icon: AtSign },
    { key: 'village', label: 'Village', value: user?.village || '', placeholder: 'Select your village', icon: MapPin },
    { key: 'block', label: 'Block / Area', value: user?.block || '', placeholder: 'Optional', icon: Building2 },
    { key: 'district', label: 'District', value: user?.district || 'Farrukhabad', placeholder: 'Farrukhabad', icon: MapPin },
  ]

  const emailVerified = Boolean(user?.emailVerified)
  const phoneVerified = Boolean(user?.phoneVerified)

  useEffect(() => {
    const next = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
      village: user?.village || initialLocation?.name || '',
      block: user?.block || '',
      district: user?.district || initialLocation?.district || 'Farrukhabad',
      bio: user?.bio || '',
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    }
    setForm(next)
  }, [user, initialLocation])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) {
      setShowPermissionModal(false)
    }
  }, [location])

  useEffect(() => {
    if (!editing) return

    const normalized = String(form.username || '').trim().replace(/^@/, '').toLowerCase()
    const current = String(user?.username || '').trim().replace(/^@/, '').toLowerCase()

    if (!normalized || normalized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    if (normalized === current) {
      setUsernameStatus('available')
      return
    }

    setUsernameStatus('checking')
    const timer = window.setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(normalized)
        setUsernameStatus(isAvailable ? 'available' : 'taken')
      } catch {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [editing, form.username, user?.username, checkUsernameAvailability])

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const saveChanges = async () => {
    if (usernameStatus === 'checking') {
      alert('Please wait while username availability is being checked')
      return
    }
    if (usernameStatus === 'taken') {
      alert('Username is already taken')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        username: String(form.username || '').replace(/^@/, ''),
        village: form.village,
        block: form.block,
        district: form.district || 'Farrukhabad',
        bio: form.bio,
        interests: String(form.interests || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', err)
      alert(err.message || 'Failed to save')
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch {
      // fallback is manual selection
    }
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setShowLocationPicker(false)
  }

  const handleSaveLocation = async () => {
    if (!location) return
    try {
      await updateProfile({
        village: location.name,
        locationName: location.name,
        locationType: location.type,
        district: location.district,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
      })
      alert('Location updated')
      setShowLocationPicker(false)
    } catch (err) {
      alert(err.message || 'Failed to update location')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4] flex flex-col">
      <Header scrolled={false} />
      <main className="flex-1 px-3 pt-6 pb-10 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title="My Profile" subtitle="View your account details" />

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
              </div>
              <div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={saveChanges}>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
              {details.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon size={14} /> {item.label}
                    </p>
                    {!editing ? (
                      <p className={`mt-2 break-all text-base font-semibold ${item.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.value || item.placeholder}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={form[item.key] || ''}
                          placeholder={item.placeholder}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          disabled={item.key === 'district'}
                          error={item.key === 'username' && usernameStatus === 'taken' ? 'Username is already taken' : ''}
                        />
                        {item.key === 'username' && (
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            {usernameStatus === 'checking' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="text-slate-500">Checking username...</span>
                              </>
                            )}
                            {usernameStatus === 'available' && (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-emerald-700">Username is available</span>
                              </>
                            )}
                            {usernameStatus === 'taken' && (
                              <>
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-rose-700">Username is not available</span>
                              </>
                            )}
                            {usernameStatus === 'error' && (
                              <span className="text-slate-500">Could not check availability right now</span>
                            )}
                            {usernameStatus === 'idle' && (
                              <span className="text-slate-500">example: @ravikumar</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Info size={14} /> Bio
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>
                    {user?.bio || 'Tell us about yourself...'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <TextArea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Sharing local updates from my village."
                      maxLength={160}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AtSign size={14} /> Interests
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>
                    {Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <Input
                      value={form.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      placeholder="Local News, Farming, Education"
                      helperText="Add comma separated interests"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${phoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {phoneVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify mobile</Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {emailVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify email</Button>
                      )}
                    </div>
                  </div>
                </div>

                {(!phoneVerified || !emailVerified) && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs text-amber-700 font-semibold">
                    <ShieldAlert size={14} /> Complete pending verification to increase trust and reach.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  {location ? buildDisplayName(location) : 'Set your location'}
                </h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                Change
              </Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? (
                <LocationConfirmCard
                  location={location}
                  onConfirm={handleSaveLocation}
                  onChange={() => setShowLocationPicker(true)}
                  loading={isDetecting}
                  mobile={isMobile}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Tap Change or allow access when prompted.
                </div>
              )}
              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>
        </div>
      </main>
      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handleAllowLocation}
        onChooseManually={handleChooseLocationManually}
        loading={isDetecting}
        error={locationError}
      />

      {showLocationPicker && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}import { motion } from 'framer-motion'
import { Mail, UserCircle2, Edit2, Check, X, Phone, AtSign, MapPin, Building2, ShieldAlert, ShieldCheck, Info } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import useAuth from '../hooks/useAuth'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import { useState, useEffect } from 'react'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

export default function Profile() {
  const { user, updateProfile, checkUsernameAvailability } = useAuth()
  const initialLocation = user?.locationName
    ? {
        name: user.locationName,
        type: user.locationType || 'Village',
        district: user.district || 'Farrukhabad',
        tehsil: user.tehsil || user.district || 'Farrukhabad',
        state: user.state || 'Uttar Pradesh',
        lat: user.lat ?? null,
        lng: user.lng ?? null,
      }
    : null

  const {
    location,
    confirmLocation,
    detectLocation,
    isDetecting,
    error: locationError,
    searchQuery,
    setSearchQuery,
    matchingLocations,
  } = useLocation(initialLocation)

  const [editing, setEditing] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    village: user?.village || '',
    block: user?.block || '',
    district: user?.district || 'Farrukhabad',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
  })

  const details = [
    { key: 'name', label: 'Full Name', value: user?.name || '', placeholder: 'Enter your full name', icon: UserCircle2 },
    { key: 'email', label: 'Email Address', value: user?.email || '', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Mobile Number', value: user?.phone || '', placeholder: 'Enter mobile number', icon: Phone },
    { key: 'username', label: 'Username', value: user?.username ? `@${String(user.username).replace(/^@/, '')}` : '', placeholder: '@ravikumar', icon: AtSign },
    { key: 'village', label: 'Village', value: user?.village || '', placeholder: 'Select your village', icon: MapPin },
    { key: 'block', label: 'Block / Area', value: user?.block || '', placeholder: 'Optional', icon: Building2 },
    { key: 'district', label: 'District', value: user?.district || 'Farrukhabad', placeholder: 'Farrukhabad', icon: MapPin },
  ]

  const emailVerified = Boolean(user?.emailVerified)
  const phoneVerified = Boolean(user?.phoneVerified)

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }))

  const saveChanges = async () => {
    if (usernameStatus === 'checking') {
      alert('Please wait while username availability is being checked')
      return
    }
    if (usernameStatus === 'taken') {
      alert('Username is already taken')
      return
    }

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        username: String(form.username || '').replace(/^@/, ''),
        village: form.village,
        block: form.block,
        district: form.district || 'Farrukhabad',
        bio: form.bio,
        interests: String(form.interests || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', err)
      alert(err.message || 'Failed to save')
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch (err) {}
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSkipLocation = () => {
    setShowPermissionModal(false)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setShowLocationPicker(false)
  }

  const handleSaveLocation = async () => {
    if (!location) return
    try {
      await updateProfile({
        village: location.name,
        locationName: location.name,
        locationType: location.type,
        district: location.district,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
      })
      alert('Location updated')
      setShowLocationPicker(false)
    } catch (err) {
      alert(err.message || 'Failed to update location')
    }
  }

  // keep form in sync if user changes
  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
      village: user?.village || '',
      block: user?.block || '',
      district: user?.district || 'Farrukhabad',
      bio: user?.bio || '',
      interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    })
  }, [user])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) setShowPermissionModal(false)
  }, [location])

  useEffect(() => {
    if (!editing) return

    const normalized = String(form.username || '').trim().replace(/^@/, '').toLowerCase()
    if (normalized.length < 3) {
      setUsernameStatus('idle')
      return
    }

    if (normalized === current) {
      setUsernameStatus('available')
      return
    }

    setUsernameStatus('checking')
    const timer = window.setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(normalized)
        setUsernameStatus(isAvailable ? 'available' : 'taken')
      } catch (err) {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [editing, form.username, user?.username, checkUsernameAvailability])

  return (
    <div className="min-h-screen bg-[#f7f8f4] flex flex-col">
      <Header scrolled={false} />
      <main className="flex-1 px-3 pt-6 pb-10 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            title="My Profile"
            subtitle="View your account details"
            // right side: edit button
          />

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
              </div>
              <div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={saveChanges}>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
              {details.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Icon size={14} /> {item.label}
                    </p>
                    {!editing ? (
                      <p className={`mt-2 break-all text-base font-semibold ${item.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {item.value || item.placeholder}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Input
                          value={form[item.key] || ''}
                          placeholder={item.placeholder}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          disabled={item.key === 'district'}
                          error={
                            item.key === 'username' && usernameStatus === 'taken'
                              ? 'Username is already taken'
                              : ''
                          }
                          helperText={
                            item.key === 'username'
                              ? (usernameStatus === 'checking'
                                ? 'Checking username...'
                                : usernameStatus === 'available'
                                  ? 'Username is available'
                                  : usernameStatus === 'error'
                                    ? 'Could not check availability right now'
                                    : 'example: @ravikumar')
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Info size={14} /> Bio
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>
                    {user?.bio || 'Tell us about yourself...'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <TextArea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Sharing local updates from my village."
                      maxLength={160}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <AtSign size={14} /> Interests
                </p>
                {!editing ? (
                  <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>
                    {Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}
                  </p>
                ) : (
                  <div className="mt-2">
                    <Input
                      value={form.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      placeholder="Local News, Farming, Education"
                      helperText="Add comma separated interests"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${phoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {phoneVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {phoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify mobile</Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {emailVerified ? 'Verified' : 'Pending verification'}
                      </p>
                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span>
                      ) : (
                        <Button type="button" size="xs" variant="outline">Verify email</Button>
                      )}
                    </div>
                  </div>
                </div>

                {(!phoneVerified || !emailVerified) && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs text-amber-700 font-semibold">
                    <ShieldAlert size={14} /> Complete pending verification to increase trust and reach.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Set your location'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                Change
              </Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? (
                <LocationConfirmCard
                  location={location}
                  onConfirm={handleSaveLocation}
                  onChange={() => setShowLocationPicker(true)}
                  loading={isDetecting}
                  mobile={isMobile}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Tap Change or allow access when prompted.
                </div>
              )}
              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>
        </div>
      </main>
      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={handleAllowLocation}
        onChooseManually={handleChooseLocationManually}
        onSkip={handleSkipLocation}
        loading={isDetecting}
        error={locationError}
        mobile={isMobile}
      />

      {showLocationPicker && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <LocationPicker
                query={searchQuery}
                onQueryChange={setSearchQuery}
                options={matchingLocations}
                onSelect={handleSelectLocation}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}
