import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image as ImageIcon, ShieldCheck, Upload, XCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'
import { Button } from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
import useLocation from '../hooks/useLocation'
import LocationPermissionModal from '../components/location/LocationPermissionModal'
import LocationConfirmCard from '../components/location/LocationConfirmCard'
import LocationPicker from '../components/location/LocationPicker'
import { BottomSheet, Modal } from '../components/ui/Modals'
import { buildDisplayName } from '../services/locationService'

function Report() {
  const { t } = useLanguage()
  const { user } = useAuth()
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

  const reporterDetails = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: reporterDetails.name,
      email: reporterDetails.email,
      phone: reporterDetails.phone,
    }
  })
  const [submitted, setSubmitted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [cloudinaryConfig, setCloudinaryConfig] = useState({ folder: 'apnafarrukhabad/news' })
  const [cloudinaryMissing, setCloudinaryMissing] = useState(false)
  const [locationConfirmed, setLocationConfirmed] = useState(Boolean(user?.locationVerified || initialLocation))
  const [showPermissionModal, setShowPermissionModal] = useState(!initialLocation)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showLocationConfirmModal, setShowLocationConfirmModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successSubmission, setSuccessSubmission] = useState(null)
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (reporterDetails.name) setValue('name', reporterDetails.name)
    if (reporterDetails.email) setValue('email', reporterDetails.email)
    if (reporterDetails.phone) setValue('phone', reporterDetails.phone)
  }, [user, setValue])

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
    if (locationConfirmed) {
      setShowLocationConfirmModal(false)
    }
  }, [locationConfirmed])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    setImageError('')
    setUploadedImage(null)

    if (!file) {
      setSelectedImage(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview('')
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file')
      return
    }

    setSelectedImage(file)

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    const nextPreview = URL.createObjectURL(file)
    setImagePreview(nextPreview)

    try {
      setImageUploading(true)
      if (cloudinaryMissing) {
        setImageError('Image upload is currently unavailable. Please try again later.')
        setUploadedImage(null)
      } else {
        const cloud = await import('../services/cloudinary.service')
        const result = await cloud.uploadImage(file)
        setUploadedImage(result)
      }
    } catch (error) {
      setImageError(error.message || 'Image upload failed')
      setUploadedImage(null)
    } finally {
      setImageUploading(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setUploadedImage(null)
    setImageError('')
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview('')
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleAllowLocation = async () => {
    try {
      await detectLocation()
      setLocationConfirmed(true)
      setShowPermissionModal(false)
      setShowLocationPicker(false)
    } catch (err) {}
  }

  const handleChooseLocationManually = () => {
    setShowPermissionModal(false)
    setShowLocationPicker(true)
  }

  const handleSelectLocation = (nextLocation) => {
    confirmLocation(nextLocation)
    setLocationConfirmed(true)
    setShowLocationPicker(false)
  }

  const handleConfirmLocation = () => {
    if (!location) return
    setLocationConfirmed(true)
    setShowLocationPicker(false)
    setShowLocationConfirmModal(false)
  }

  const onSubmit = (data) => {
    if (!location) {
      alert('Please set your location before submitting the report')
      return
    }

    const payload = {
      ...data,
      userId: user?.id || '',
      avatar: user?.avatar || '',
      name: reporterDetails.name || data.name,
      email: reporterDetails.email || data.email,
      phone: reporterDetails.phone || data.phone,
      village: location.name,
      locationName: location.name,
      locationType: location.type,
      district: location.district,
      tehsil: location.tehsil,
      state: location.state,
      lat: location.lat,
      lng: location.lng,
      locationVerified: true,
      imageUrl: uploadedImage?.secureUrl || '',
      imagePublicId: uploadedImage?.publicId || '',
      imageName: selectedImage?.name || '',
      imageFolder: cloudinaryConfig.folder,
    }
    // create pending submission via dynamic import (avoid top-level module errors)
    import('../services/mediaModeration.service')
      .then(async (mod) => {
        const queuedSubmission = await mod.createPendingSubmission(payload)
        setSuccessSubmission(queuedSubmission)
        setShowSuccessModal(true)
        setSubmitted(true)
        reset()
        clearImage()
        setTimeout(() => setSubmitted(false), 3000)
      })
      .catch((err) => {
        alert(err.message || 'Failed to queue submission')
      })
  }

  useEffect(() => {
    import('../services/cloudinary.service')
      .then((m) => {
        const cfg = m.getCloudinaryConfig()
        setCloudinaryConfig(cfg)
        if (!cfg.cloudName || !cfg.uploadPreset) setCloudinaryMissing(true)
      })
      .catch(() => {})
  }, [])
  const submitDisabled = imageUploading || (selectedImage && !uploadedImage && !cloudinaryMissing)

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-6 sm:px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <SectionHeader title={t('submitReport')} subtitle={t('shareNews')} />

          <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reporting from</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-900">{location ? buildDisplayName(location) : 'Choose your location'}</h2>
                <p className="mt-1 text-sm text-slate-600">This helps local readers understand where the report was filed from.</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                {location ? `Your location: ${buildDisplayName(location)}.` : 'Getting your location...'}
              </div>
            </div>

            {locationError && <p className="mt-3 text-sm font-semibold text-rose-700">{locationError}</p>}

            <p className="mt-2 text-xs font-semibold text-emerald-700">
              Location set. You can change it if needed.
            </p>
          </div>
          
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-5 shadow-soft">
            <div className="space-y-5 sm:space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-navy-900">{t('reportTitle')}</label>
                <input
                  type="text"
                  placeholder={t('enterTitle')}
                  {...register('title', { required: t('reportTitle') + ' आवश्यक है' })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:border-agri-500 focus:outline-none focus:ring-2 focus:ring-agri-500/20"
                />
                {errors.title && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.title.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-navy-900">{t('category')}</label>
                <select
                  {...register('category', { required: t('category') + ' आवश्यक है' })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                >
                  <option value="">{t('selectCategory')}</option>
                  <option value="agriculture">{t('agriculture')}</option>
                  <option value="health">{t('health')}</option>
                  <option value="education">{t('education')}</option>
                  <option value="infrastructure">ढांचा</option>
                  <option value="other">अन्य</option>
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
              </div>
              
              {/* User Status */}
              {user && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Reporter details fetched from your account</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">These values are locked while you submit a report.</p>
                    </div>
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Name</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{reporterDetails.name || 'Not available'}</p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Email</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{reporterDetails.email || 'Not available'}</p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{reporterDetails.phone || 'Not available'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-bold text-navy-900">News Image</label>
                </div>
                <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="report-image-input"
                  />

                  {!imagePreview ? (
                    <label htmlFor="report-image-input" className="flex cursor-pointer flex-col items-center justify-center gap-2 py-4 text-center">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                        <ImageIcon size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Upload a photo with your report</p>
                        <p className="text-xs text-slate-500">PNG, JPG, JPEG, WebP</p>
                      </div>
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img src={imagePreview} alt="Selected report preview" className="h-48 w-full object-cover" />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-slate-600">
                          <p className="font-semibold text-slate-800">{selectedImage?.name}</p>
                          <p>{imageUploading ? 'Uploading image...' : uploadedImage ? 'Uploaded and ready to save' : 'Waiting for upload'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="report-image-input" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            <Upload size={14} /> Replace
                          </label>
                          <button
                            type="button"
                            onClick={clearImage}
                            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                          >
                            <XCircle size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {imageUploading && <p className="mt-2 text-xs font-semibold text-emerald-700">Uploading image...</p>}
                {imageError && <p className="mt-2 text-xs font-semibold text-red-600">{imageError}</p>}
                {cloudinaryMissing && (
                  <p className="mt-2 text-sm font-semibold text-rose-600">
                    Image upload is not available. Please try again later.
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-navy-900">{t('description')}</label>
                <textarea
                  placeholder={t('enterDescription')}
                  rows="5"
                  {...register('description', { required: t('description') + ' आवश्यक है', minLength: { value: 20, message: 'कम से कम 20 शब्द लिखें' } })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              {/* Contact */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-navy-900">{t('name')}</label>
                  <input
                    type="text"
                    placeholder={t('enterName')}
                    {...register('name', { required: t('name') + ' आवश्यक है' })}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-navy-900">{t('phone')}</label>
                    <input
                      type="tel"
                      placeholder={t('enterPhone')}
                      {...register('phone', { required: t('phone') + ' आवश्यक है' })}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-agri-500 focus:outline-none"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
            </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitDisabled}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full rounded-lg bg-gradient-to-r from-agri-700 to-agri-500 px-6 py-4 font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] sm:mt-6"
            >
              {t('submit')}
            </motion.button>

            {submitDisabled && selectedImage && (
              <p className="mt-2 text-xs font-semibold text-amber-700">
                Wait for the image upload to finish before submitting.
              </p>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
              >
                Sent to admin for approval. It will appear on the home page after review.
              </motion.div>
            )}
          </motion.form>
        </div>

        {showSuccessModal && successSubmission && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Report Submitted" size="md">
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm font-semibold text-emerald-700">✅ Your report has been sent for approval!</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Title</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{successSubmission.title}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Description</p>
                  <p className="mt-1 text-sm text-slate-700 line-clamp-3">{successSubmission.description}</p>
                </div>

                {successSubmission.imageName && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Image Uploaded</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{successSubmission.imageName}</p>
                  </div>
                )}

                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Status:</span> Pending review
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Your report will appear on the home page once approved by our team.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={() => setShowSuccessModal(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal>
        )}

        <LocationPermissionModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onAllow={handleAllowLocation}
          onChooseManually={handleChooseLocationManually}
          loading={isDetecting}
          error={locationError}
        />

        {false && (
          <Modal isOpen={showLocationConfirmModal} onClose={() => setShowLocationConfirmModal(false)} title="Confirm location" size="md">
            <div className="space-y-4">
              {location ? (
                <LocationConfirmCard
                  location={location}
                  onConfirm={handleConfirmLocation}
                  onChange={() => {
                    setShowLocationConfirmModal(false)
                    setShowLocationPicker(true)
                  }}
                  loading={isDetecting}
                  mobile={isMobile}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No location selected yet. Allow access or choose manually.
                </div>
              )}

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => setShowLocationConfirmModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}

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
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default Report
