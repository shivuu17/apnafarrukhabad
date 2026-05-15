import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
import * as mediationService from '../services/mediaModeration.service'

function ProfilePage() {
  const { user, updateProfile, checkUsernameAvailability, sendEmailVerificationCode, verifyEmailCode } = useAuth()
  const navigate = useNavigate()

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
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [userReports, setUserReports] = useState([])
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

  const reportSummary = {
    total: userReports.length,
    pending: userReports.filter((report) => report.statusType === 'pending').length,
    approved: userReports.filter((report) => report.statusType === 'approved').length,
  }

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
      // Manual choice stays available.
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

  const handleEditProfile = () => {
    navigate('/onboarding')
  }

  const loadUserReports = async () => {
    try {
      const [pending, approved] = await Promise.all([
        mediationService.getPendingSubmissions(),
        mediationService.getApprovedSubmissions(),
      ])

      const normalizeValue = (value) => String(value || '').trim().toLowerCase()
      const userEmail = normalizeValue(user?.email)
      const userPhone = normalizeValue(user?.phone)
      const userName = normalizeValue(user?.name)

      const belongsToCurrentUser = (report) => {
        const reportEmail = normalizeValue(report.email)
        const reportPhone = normalizeValue(report.phone)
        const reportName = normalizeValue(report.reporterName)

        return Boolean(
          (userEmail && reportEmail && reportEmail === userEmail) ||
          (userPhone && reportPhone && reportPhone === userPhone) ||
          (userName && reportName && reportName === userName)
        )
      }

      const currentUserPending = (pending || []).filter(belongsToCurrentUser)
      const currentUserApproved = (approved || []).filter(belongsToCurrentUser)

      const allReports = [...currentUserPending, ...currentUserApproved].map((report) => ({
        ...report,
        statusType: currentUserPending.some((pendingReport) => pendingReport.id === report.id) ? 'pending' : 'approved',
      }))

      setUserReports(allReports)
      setShowReportsModal(true)
    } catch (error) {
      console.error('Failed to load reports:', error)
      setUserReports([])
      setShowReportsModal(true)
    }
  }

  const handleSendEmailCode = async () => {
    try {
      setEmailVerifying(true)
      await sendEmailVerificationCode(user?.email)
      setEmailCodeSent(true)
      alert('Verification link sent to your email')
    } catch (error) {
      alert(error?.message || 'Failed to send code')
    } finally {
      setEmailVerifying(false)
    }
  }

  const handleCheckEmailVerification = async () => {
    try {
      setEmailVerifying(true)
      await verifyEmailCode(user?.email)
      alert('Your email is verified')
      setShowEmailVerification(false)
      setEmailCodeSent(false)
    } catch (error) {
      alert(error?.message || 'Email is not verified yet')
    } finally {
      setEmailVerifying(false)
    }
  }

  useEffect(() => {
    if (!showEmailVerification || !emailCodeSent || emailVerified) return

    const timer = window.setInterval(async () => {
      try {
        await verifyEmailCode(user?.email)
        alert('Your email is verified')
        setShowEmailVerification(false)
        setEmailCodeSent(false)
      } catch {
        // Still waiting for user to click the verification link in email.
      }
    }, 5000)

    return () => window.clearInterval(timer)
  }, [showEmailVerification, emailCodeSent, emailVerified, user?.email, verifyEmailCode])

  

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8f4]">
      <Header scrolled={false} />
      <main className="flex-1 px-3 pb-10 pt-6 sm:px-4 sm:pb-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader title="My Profile" subtitle="View your account details" />

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Account</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">{user?.name || 'User'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">{user?.email || 'No email available'}</p>
                <p className="mt-2 text-xs text-slate-500">Edit details in onboarding and keep your report status in the profile view.</p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit My Profile
                </Button>
                <Button variant="primary" size="sm" onClick={loadUserReports}>
                  <Info className="mr-2 h-4 w-4" /> View News Status
                </Button>
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
                        <Input value={form[item.key] || ''} placeholder={item.placeholder} onChange={(event) => handleChange(item.key, event.target.value)} disabled={item.key === 'district'} error={item.key === 'username' && usernameStatus === 'taken' ? 'Username is already taken' : ''} />
                        {item.key === 'username' && (
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            {usernameStatus === 'checking' && <><Loader2 className="h-4 w-4 animate-spin text-slate-400" /><span className="text-slate-500">Checking username...</span></>}
                            {usernameStatus === 'available' && <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="text-emerald-700">Username is available</span></>}
                            {usernameStatus === 'taken' && <><XCircle className="h-4 w-4 text-rose-600" /><span className="text-rose-700">Username is not available</span></>}
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
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Info size={14} /> Bio</p>
                {!editing ? <p className={`mt-2 text-base ${user?.bio ? 'text-slate-900' : 'text-slate-400'}`}>{user?.bio || 'Tell us about yourself...'}</p> : <div className="mt-2"><TextArea value={form.bio} onChange={(event) => handleChange('bio', event.target.value)} placeholder="Sharing local updates from my village." maxLength={160} rows={4} /></div>}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><AtSign size={14} /> Interests</p>
                {!editing ? <p className={`mt-2 text-base ${Array.isArray(user?.interests) && user.interests.length ? 'text-slate-900' : 'text-slate-400'}`}>{Array.isArray(user?.interests) && user.interests.length ? user.interests.join(', ') : 'No interests added'}</p> : <div className="mt-2"><Input value={form.interests} onChange={(event) => handleChange('interests', event.target.value)} placeholder="Local News, Farming, Education" helperText="Add comma separated interests" /></div>}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification Status</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${emailVerified ? 'text-emerald-700' : 'text-amber-700'}`}>{emailVerified ? 'Verified' : 'Pending verification'}</p>
                      {emailVerified ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Verified</span> : <Button type="button" size="xs" variant="outline" onClick={() => setShowEmailVerification(true)}>Verify email</Button>}
                    </div>
                  </div>
                </div>
                {!emailVerified && <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-700"><ShieldAlert size={14} /> Complete pending verification to increase trust and reach.</p>}
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-emerald-50/70 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Set your location'}</h2>
                <p className="mt-1 break-all text-sm text-slate-600">Used for local reports, trust signals, and regional feeds.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>Change</Button>
            </div>

            <div className="p-4 sm:p-6">
              {location ? <LocationConfirmCard location={location} onConfirm={handleSaveLocation} onChange={() => setShowLocationPicker(true)} loading={isDetecting} mobile={isMobile} /> : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No location selected yet. Tap Change or allow access when prompted.</div>}
              {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-emerald-100 bg-white shadow-soft">
            <div className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">News status</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900">Your submitted news</h2>
              <p className="mt-1 text-sm text-slate-600">Track only your own reports with an animated timeline.</p>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{reportSummary.total}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending review</p>
                <p className="mt-1 text-2xl font-black text-amber-800">{reportSummary.pending}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
                <p className="mt-1 text-2xl font-black text-emerald-800">{reportSummary.approved}</p>
              </div>
            </div>

            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
              <Button variant="primary" onClick={loadUserReports} fullWidth>
                View News Status Timeline
              </Button>
            </div>
          </motion.section>
        </div>
      </main>

      {!editing && <Footer />}
      <MobileNav />

      <LocationPermissionModal isOpen={showPermissionModal} onClose={() => setShowPermissionModal(false)} onAllow={handleAllowLocation} onChooseManually={handleChooseLocationManually} loading={isDetecting} error={locationError} />

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

      {/* Email Verification Modal */}
      <Modal isOpen={showEmailVerification} onClose={() => { setShowEmailVerification(false); setEmailCodeSent(false); }} title="Verify Email" size="sm">
        <div className="space-y-4">
          {!emailCodeSent ? (
            <>
              <p className="text-sm text-slate-600">We'll send a verification link to <strong>{user?.email}</strong></p>
              <Button onClick={handleSendEmailCode} variant="primary" fullWidth loading={emailVerifying}>
                Send Verification Link
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600">Open your inbox and click the verification link. We will automatically check your verification status.</p>
              <div className="flex gap-2">
                <Button onClick={() => { setEmailCodeSent(false); }} variant="secondary" fullWidth>
                  Back
                </Button>
                <Button onClick={handleCheckEmailVerification} variant="primary" fullWidth loading={emailVerifying}>
                  Check status
                </Button>
              </div>
              <button onClick={handleSendEmailCode} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                Didn't receive email? Resend link
              </button>
            </>
          )}
        </div>
      </Modal>

      <Modal isOpen={showReportsModal} onClose={() => setShowReportsModal(false)} title="News Status Timeline" size="lg">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total news</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{reportSummary.total}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending review</p>
              <p className="mt-1 text-2xl font-black text-amber-800">{reportSummary.pending}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
              <p className="mt-1 text-2xl font-black text-emerald-800">{reportSummary.approved}</p>
            </div>
          </div>

          {userReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <Info size={28} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No submitted news found for this account</p>
              <p className="mt-1 text-xs text-slate-500">Only your own submitted news will show here.</p>
            </div>
          ) : (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {userReports.map((report, index) => {
                const isApproved = report.statusType === 'approved'
                const steps = [
                  {
                    key: 'submitted',
                    label: 'Submitted',
                    detail: new Date(report.createdAt).toLocaleDateString(),
                  },
                  {
                    key: 'review',
                    label: 'Pending review',
                    detail: isApproved ? 'Reviewed by admin' : 'Waiting for moderation',
                  },
                  {
                    key: 'approved',
                    label: 'Approved',
                    detail: isApproved && report.approvedAt ? new Date(report.approvedAt).toLocaleDateString() : 'Approval pending',
                  },
                ]

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold text-slate-900">{report.title}</h4>
                        <p className="mt-1 text-xs text-slate-600">{report.village || 'Unknown location'}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isApproved ? 'Approved' : 'Pending review'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {steps.map((step, stepIndex) => {
                        const completed = stepIndex === 0 || (stepIndex === 1 && !isApproved) || (isApproved && stepIndex <= 2)
                        const active = (!isApproved && stepIndex === 1) || (isApproved && stepIndex === 2)

                        return (
                          <div key={step.key} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <motion.div
                                animate={{ scale: active ? 1.08 : 1 }}
                                transition={{ duration: 0.25 }}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-slate-400'}`}
                              >
                                {stepIndex + 1}
                              </motion.div>
                              {stepIndex < steps.length - 1 && (
                                <motion.div
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ duration: 0.25, delay: index * 0.04 + stepIndex * 0.05 }}
                                  className={`mt-1 h-8 w-px origin-top ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className={`text-sm font-semibold ${completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                              <p className="mt-0.5 text-xs text-slate-500">{step.detail}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <Button type="button" variant="outline" onClick={() => setShowReportsModal(false)} fullWidth>
            Close
          </Button>
        </div>
      </Modal>

      {/* reCAPTCHA container (phone verification removed) */}
    </div>
  )
}

export default ProfilePage