import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Input, TextArea } from '../components/ui/FormInputs'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/Layout'
import useAuth from '../hooks/useAuth'
import cloudinary from '../services/cloudinary.service'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

const roles = [
  'Citizen Reporter',
  'Farmer',
  'Student',
  'Teacher',
  'Shopkeeper',
  'Social Worker',
  'Journalist',
  'Business Owner',
  'Other'
]

const interests = [
  'Local News',
  'Farming',
  'Education',
  'Weather',
  'Health',
  'Sports',
  'Community Issues',
  'Business',
  'Events'
]

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  username: z.string().min(3, 'Choose a username').regex(/^@?\w{3,}$/, 'Username must be letters, numbers or underscore'),
  village: z.string().min(1, 'Select your village'),
  block: z.string().optional(),
  district: z.string().optional(),
  role: z.string().min(1, 'Select one role'),
  bio: z.string().max(160).optional(),
  interests: z.array(z.string()).optional(),
})

export default function OnboardingProfile() {
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

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [locationConfirmed, setLocationConfirmed] = useState(Boolean(user?.locationVerified || initialLocation))
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const defaultValues = useMemo(() => ({
    name: user?.name || '',
    username: user?.username || '',
    village: user?.village || initialLocation?.name || '',
    block: user?.block || '',
    district: user?.district || initialLocation?.district || 'Farrukhabad',
    role: user?.role || '',
    bio: user?.bio || '',
    interests: user?.interests || []
  }), [user, initialLocation])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema), defaultValues })

  const bio = watch('bio') || ''
  const usernameValue = watch('username') || ''
  const selectedRole = watch('role')
  const selectedInterests = watch('interests') || []

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (location) {
      setValue('village', location.name, { shouldValidate: true })
      setValue('district', location.district || 'Farrukhabad', { shouldValidate: true })
      setShowPermissionModal(false)
    }
  }, [location, setValue])

  useEffect(() => {
    const normalized = String(usernameValue || '').trim().replace(/^@/, '').toLowerCase()
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
      } catch (err) {
        setUsernameStatus('error')
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [usernameValue, user?.username, checkUsernameAvailability])

  const onFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const res = await cloudinary.uploadImage(file)
      setAvatarPreview(res.secureUrl)
      setValue('avatar', res.secureUrl)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload failed', err)
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setLocationConfirmed(false)
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch (err) {
      // stay open for retry/manual fallback
    }
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setLocationConfirmed(false)
    setShowLocationPicker(false)
  }

  const handleConfirmLocation = () => {
    if (!location) return
    setLocationConfirmed(true)
    setShowLocationPicker(false)
  }

  const onSubmit = async (values) => {
    if (usernameStatus === 'checking') return alert('Please wait while username availability is being checked')
    if (usernameStatus === 'taken') return alert('Username already taken')
    if (!location || !locationConfirmed) return alert('Please confirm your location before continuing')
    try {
      await updateProfile({
        name: values.name,
        username: values.username.replace(/^@/, ''),
        village: values.village,
        block: values.block,
        district: values.district || 'Farrukhabad',
        locationName: location.name,
        locationType: location.type,
        tehsil: location.tehsil,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        locationVerified: true,
        role: values.role,
        bio: values.bio,
        interests: values.interests || [],
        avatar: values.avatar || avatarPreview || ''
      })
      // navigate to profile or home
      window.location.href = '/profile'
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert(err.message || 'Failed to save profile')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] p-4">
      <div className="mx-auto max-w-[900px]">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] bg-white/80 border border-neutral-100 shadow-soft p-5 sm:p-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-500">Step 2 of 2</p>
              <h1 className="mt-3 text-2xl font-extrabold text-[#06391C]">Complete Your Profile</h1>
              <p className="mt-2 text-sm text-neutral-600">Set up your profile and start sharing trusted local stories.</p>
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your location</p>
                  <h2 className="mt-1 text-lg font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Choose your village or town'}</h2>
                  <p className="mt-1 text-sm text-slate-600">We use this to show local stories and improve report accuracy. Only village or town level is public.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                  Change
                </Button>
              </div>

              <div className="mt-4">
                {location ? (
                  <LocationConfirmCard
                    location={location}
                    onConfirm={handleConfirmLocation}
                    onChange={() => setShowLocationPicker(true)}
                    loading={isDetecting}
                    mobile={isMobile}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                    No location selected yet. Tap Change or allow access when prompted.
                  </div>
                )}
              </div>

              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}

              <p className="mt-2 text-xs font-semibold text-amber-700">
                {locationConfirmed ? 'Location confirmed.' : 'Please confirm your detected or selected location.'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-2 flex flex-col items-center">
                <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="flex flex-col items-center">
                  <div className="rounded-full p-1 bg-gradient-to-br from-[#178A49] to-[#0F6B35]">
                    <div className="rounded-full bg-white p-2">
                      <Avatar src={avatarPreview} name={watch('name') || user?.name || 'User'} size="xl" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="inline-flex">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                      <Button type="button" variant="outline">{uploading ? 'Uploading...' : 'Upload photo'}</Button>
                    </label>
                    <button type="button" onClick={() => { setAvatarPreview(''); setValue('avatar', '') }} className="text-sm text-neutral-500">Remove</button>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Add a clear profile photo to build trust.</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input label="Full Name" placeholder="Enter your full name" {...register('name')} error={errors.name?.message} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input
                  label="Username"
                  placeholder="Choose a unique username"
                  {...register('username')}
                  error={errors.username?.message || (usernameStatus === 'taken' ? 'Username already taken' : '')}
                />
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
              </div>

              <input type="hidden" {...register('village')} />

              <div className="col-span-2 sm:col-span-1">
                <Input label="Block / Area" placeholder="Optional" {...register('block')} error={errors.block?.message} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input label="District" placeholder="Farrukhabad" {...register('district')} disabled />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Select a role</label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <button key={r} type="button" onClick={() => setValue('role', r)} className={`px-3 py-2 rounded-full border ${selectedRole === r ? 'bg-[#0F6B35] text-white' : 'bg-white text-neutral-700'} hover:scale-105 transition`}>{r}</button>
                  ))}
                </div>
                {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Tell us about yourself</label>
                <TextArea placeholder="Sharing local updates from my village." rows={4} maxLength={160} {...register('bio')} error={errors.bio?.message} helperText={`${bio.length}/160`} />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-neutral-800 mb-2">Topics you care about</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((t) => {
                    const active = selectedInterests.includes(t)
                    return (
                      <button key={t} type="button" onClick={() => {
                        const current = new Set(selectedInterests)
                        if (current.has(t)) current.delete(t)
                        else current.add(t)
                        setValue('interests', Array.from(current))
                      }} className={`px-3 py-2 rounded-lg border ${active ? 'bg-[#178A49] text-white' : 'bg-white text-neutral-700'} hover:scale-105 transition`}>{t}</button>
                    )
                  })}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="rounded-lg border p-4 bg-white">
                  <p className="text-sm font-semibold text-neutral-700">Trust</p>
                  <div className="mt-3 flex items-center gap-3 text-sm text-neutral-600">
                    <span className="inline-flex items-center gap-2">Phone verified <span className="text-green-600 font-bold">✓</span></span>
                    <span className="inline-flex items-center gap-2">Email verified <span className="text-green-600 font-bold">✓</span></span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="rounded-lg border p-4 bg-white">
                  <p className="text-sm font-semibold text-neutral-700">Profile preview</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Avatar src={avatarPreview} name={watch('name') || user?.name || 'User'} />
                    <div>
                      <div className="font-semibold text-neutral-900">{watch('name') || user?.name || 'Your name'}</div>
                      <div className="text-sm text-neutral-500">@{(watch('username') || user?.username || 'username').replace(/^@/, '')}</div>
                      <div className="text-sm text-neutral-500">{watch('village') || user?.village || 'Village'}</div>
                      <div className="text-sm text-neutral-500 mt-1">{watch('role') || user?.role || 'Role'}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-neutral-600">{watch('bio') || 'Tell people why they should trust you.'}</div>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-between gap-4">
                <button type="button" onClick={() => (window.location.href = '/')} className="text-neutral-700">Skip for now</button>
                <div className="ml-auto">
                  <Button type="submit" variant="primary" loading={isSubmitting}>Complete Profile</Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      {/* sticky mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden">
        <div className="max-w-[900px] mx-auto">
          <div className="rounded-full shadow-md bg-white p-3 flex items-center justify-between">
            <div className="text-sm text-neutral-700">Complete profile to get full access</div>
            <button onClick={() => document.querySelector('form')?.requestSubmit()} className="ml-3 bg-[#0F6B35] text-white px-4 py-2 rounded-full">Complete</button>
          </div>
        </div>
      </div>

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
              <div className="space-y-4 pb-2">
                <LocationPicker
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  options={matchingLocations}
                  onSelect={handleSelectLocation}
                />
                <Button type="button" variant="primary" fullWidth onClick={handleConfirmLocation} disabled={!location}>
                  Use selected location
                </Button>
              </div>
            </BottomSheet>
          ) : (
            <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Choose location" size="md">
              <div className="space-y-4">
                <LocationPicker
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  options={matchingLocations}
                  onSelect={handleSelectLocation}
                />
                <div className="flex justify-end">
                  <Button type="button" variant="primary" onClick={handleConfirmLocation} disabled={!location}>
                    Use selected location
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  )
}
