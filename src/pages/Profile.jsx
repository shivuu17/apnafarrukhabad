import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AtSign,
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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password')
      return
    }

    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!confirm) return

    setIsDeleting(true)
    try {
      await deleteAccount(deletePassword, deleteReason)
      alert('Your account has been successfully deleted.')
      window.location.href = '/'
    } catch (error) {
      alert(error?.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeletePassword('')
      setDeleteReason('')
    }
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

  const reportSummary = {
    total: userReports.length,
    pending: userReports.filter((report) => report.statusType === 'pending').length,
    approved: userReports.filter((report) => report.statusType === 'approved').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header scrolled={false} />

      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <SectionHeader title="My Profile" subtitle="Manage your account and personal information" />

          {/* Profile Account Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Account Details</h2>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((detail) => {
                const Icon = detail.icon
                const value = form[detail.key]

                return (
                  <div key={detail.key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Icon className="w-4 h-4" />
                      {detail.label}
                    </label>
                    {!editing ? (
                      <p className="text-slate-600">{value || detail.placeholder}</p>
                    ) : (
                      <Input
                        name={detail.key}
                        value={value}
                        onChange={(e) => handleChange(detail.key, e.target.value)}
                        placeholder={detail.placeholder}
                        disabled={detail.key === 'district'}
                      />
                    )}
                  </div>
                )
              })}

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText className="w-4 h-4" /> Bio
                </label>
                {!editing ? (
                  <p className="text-slate-600">{form.bio || 'Not set'}</p>
                ) : (
                  <TextArea
                    name="bio"
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <AtSign className="w-4 h-4" /> Interests
                </label>
                {!editing ? (
                  <p className="text-slate-600">{form.interests || 'Not set'}</p>
                ) : (
                  <Input
                    name="interests"
                    value={form.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    placeholder="Comma-separated list of interests"
                  />
                )}
              </div>

              {/* Username Status */}
              {editing && (
                <div className="sm:col-span-2">
                  {usernameStatus === 'checking' && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking username availability...
                    </div>
                  )}
                  {usernameStatus === 'available' && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      Username is available
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <X className="w-4 h-4" />
                      Username is already taken
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Verification Status
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p className={`text-sm mt-1 ${emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {emailVerified ? '✓ Verified' : '⏳ Pending'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <p className={`text-sm mt-1 ${phoneVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {phoneVerified ? '✓ Verified' : '⏳ Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {editing && (
              <div className="mt-6 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={saveChanges}>
                  Save Changes
                </Button>
              </div>
            )}
          </motion.section>

          {/* Location Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" /> Your Location
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowLocationPicker(true)}>
                Change
              </Button>
            </div>

            {location ? (
              <LocationConfirmCard location={location} />
            ) : (
              <p className="text-slate-600">No location set yet</p>
            )}
          </motion.section>

          {/* Reports Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-slate-600" /> My Reports
            </h2>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{reportSummary.total}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
                <p className="mt-1 text-2xl font-black text-amber-800">{reportSummary.pending}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
                <p className="mt-1 text-2xl font-black text-emerald-800">{reportSummary.approved}</p>
              </div>
            </div>
            <Button onClick={loadUserReports} className="w-full">
              View My Report Status
            </Button>
          </motion.section>

          {/* Delete Account Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-red-50 p-6 border border-red-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-6 h-6" /> Danger Zone
            </h2>
            <p className="text-red-700 mb-4 text-sm flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </motion.section>
        </div>
      </main>

      <Footer />
      {isMobile && <MobileNav />}

      {/* Location Permission Modal */}
      {showPermissionModal && (
        <LocationPermissionModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onAllow={handleAllowLocation}
          onChooseManually={handleChooseLocationManually}
          loading={isDetecting}
          error={locationError}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <Modal isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} title="Select Location">
          <LocationPicker
            query={searchQuery}
            onQueryChange={setSearchQuery}
            options={matchingLocations}
            onSelect={handleSelectLocation}
          />
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowLocationPicker(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveLocation}>
              Save Location
            </Button>
          </div>
        </Modal>
      )}

      {/* My Reports Modal */}
      {showReportsModal && (
        <Modal isOpen={showReportsModal} onClose={() => setShowReportsModal(false)} title="My Reports">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {userReports.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No reports submitted yet</p>
            ) : (
              userReports.map((report) => (
                <div key={report.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{report.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      report.statusType === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.statusType === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">This will permanently delete your account and cannot be undone.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Password</label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Reason (optional)</label>
              <TextArea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Why are you deleting your account?"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                  setDeleteReason('')
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Profile
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
        }, [user, initialLocation])
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

  const handleDeleteAccount = async () => {
    if (!deletePassword || !deleteReason) {
      alert('Please enter your password and reason for deletion')
      return
    }

    if (deleteReason.length < 10) {
      alert('Please provide a reason of at least 10 characters')
      return
    }

    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!confirm) return

    setIsDeleting(true)
    try {
      await deleteAccount(deletePassword, deleteReason)
      alert('Your account has been successfully deleted.')
      window.location.href = '/'
    } catch (error) {
      alert(error?.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setDeletePassword('')
      setDeleteReason('')
    }
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

export default Profile



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

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-emerald-100 bg-white shadow-soft">
            <div className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-5 sm:px-6">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <FileText size={16} /> My Reports
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-slate-900">Your submitted news & reports</h2>
                <p className="mt-1 text-sm text-slate-600">View all the news and reports you've submitted and their approval status.</p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <Button 
                variant="primary" 
                onClick={loadUserReports}
                fullWidth
              >
                <FileText size={16} className="mr-2" />
                View My Reports
              </Button>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 rounded-2xl border border-red-200 bg-red-50 shadow-soft">
            <div className="border-b border-red-100 bg-red-100/40 px-5 py-5 sm:px-6">
              <div>
                <p className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                  <Trash2 size={16} /> Danger Zone
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-slate-900">Delete your account</h2>
                <p className="mt-1 text-sm text-slate-600">Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <Button 
                variant="primary" 
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      {!editing && <Footer />}
      <MobileNav />

      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" size="md">
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ This will permanently delete your account and all data. This action cannot be undone.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-red-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900">Reason for deletion (optional)</label>
              <textarea
                placeholder="Help us improve - tell us why you're leaving..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-red-400 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                  setDeleteReason('')
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showReportsModal && (
        <Modal isOpen={showReportsModal} onClose={() => setShowReportsModal(false)} title="My Reports" size="lg">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total reports</p>
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
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <FileText size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No reports submitted yet</p>
                <p className="mt-1 text-xs text-slate-500">Start by submitting your first news report</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {userReports.map((report, index) => {
                  const isApproved = report.statusType === 'approved'
                  const completedStep = isApproved ? 2 : 1
                  const timelineSteps = [
                    {
                      key: 'submitted',
                      label: 'Submitted',
                      detail: new Date(report.createdAt).toLocaleDateString(),
                    },
                    {
                      key: 'review',
                      label: 'Pending review',
                      detail: isApproved
                        ? 'Reviewed by admin'
                        : 'Waiting for moderation',
                    },
                    {
                      key: 'approved',
                      label: 'Approved',
                      detail: isApproved && report.approvedAt
                        ? new Date(report.approvedAt).toLocaleDateString()
                        : 'Approval pending',
                    },
                  ]

                  return (
                    <motion.button
                      key={report.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      onClick={() => setSelectedReport(report)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{report.title}</h4>
                          <p className="mt-1 text-xs text-slate-600">{report.village || 'Unknown location'}</p>
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">{report.description}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isApproved ? 'Approved' : 'Pending review'}
                        </span>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <span>Timeline</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="mt-4 flex items-start gap-3">
                          {timelineSteps.map((step, stepIndex) => {
                            const isDone = stepIndex <= completedStep
                            const isCurrent = stepIndex === completedStep

                            return (
                              <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                                <motion.div
                                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                                  transition={{ duration: 0.25 }}
                                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-[11px] font-black ${
                                    isDone
                                      ? 'border-emerald-500 bg-emerald-500 text-white'
                                      : 'border-slate-300 bg-white text-slate-400'
                                  }`}
                                >
                                  {stepIndex + 1}
                                  {stepIndex < timelineSteps.length - 1 && (
                                    <span
                                      className={`absolute left-full top-1/2 h-0.5 w-full -translate-y-1/2 ${
                                        isDone ? 'bg-emerald-500' : 'bg-slate-200'
                                      }`}
                                    />
                                  )}
                                </motion.div>
                                <p className={`mt-2 text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                                  {step.label}
                                </p>
                                <p className="mt-1 text-[11px] leading-4 text-slate-500">{step.detail}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {selectedReport && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <h4 className="text-sm font-bold text-slate-900">{selectedReport.title}</h4>
                <p className="mt-2 text-sm text-slate-700">{selectedReport.description}</p>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="mt-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Hide details
                </button>
              </div>
            )}

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowReportsModal(false)}
              fullWidth
            >
              Close
            </Button>
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
