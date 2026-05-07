const STORAGE_KEY = 'af_media_moderation_v1'

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readState() {
  if (!hasWindow()) {
    return { pending: [], approved: [] }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { pending: [], approved: [] }

    const parsed = JSON.parse(raw)
    return {
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
      approved: Array.isArray(parsed.approved) ? parsed.approved : [],
    }
  } catch {
    return { pending: [], approved: [] }
  }
}

function writeState(nextState) {
  if (!hasWindow()) return nextState

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(nextState) }))
  return nextState
}

function generateId(prefix = 'submission') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeSubmission(submission, overrides = {}) {
  return {
    id: submission.id || generateId(),
    title: submission.title?.trim() || '',
    description: submission.description?.trim() || '',
    village: submission.village || '',
    category: submission.category || '',
    reporterName: submission.name?.trim() || submission.reporterName || 'Community Contributor',
    phone: submission.phone?.trim() || '',
    imageUrl: submission.imageUrl || '',
    imagePublicId: submission.imagePublicId || '',
    imageFolder: submission.imageFolder || '',
    locationName: submission.locationName || '',
    locationType: submission.locationType || '',
    district: submission.district || '',
    tehsil: submission.tehsil || '',
    state: submission.state || '',
    lat: typeof submission.lat === 'number' ? Number(submission.lat.toFixed(4)) : null,
    lng: typeof submission.lng === 'number' ? Number(submission.lng.toFixed(4)) : null,
    locationVerified: Boolean(submission.locationVerified),
    source: submission.source || 'report-form',
    status: overrides.status || submission.status || 'pending',
    createdAt: overrides.createdAt || submission.createdAt || new Date().toISOString(),
    approvedAt: overrides.approvedAt || submission.approvedAt || null,
    approvedBy: overrides.approvedBy || submission.approvedBy || null,
    reviewedAt: overrides.reviewedAt || submission.reviewedAt || null,
    reviewedBy: overrides.reviewedBy || submission.reviewedBy || null,
  }
}

export function getModerationState() {
  return readState()
}

export function getPendingSubmissions() {
  return readState().pending
}

export function getApprovedSubmissions() {
  return readState().approved
}

export function createPendingSubmission(submission) {
  const state = readState()
  const next = normalizeSubmission(submission, { status: 'pending' })
  const updatedState = {
    ...state,
    pending: [next, ...state.pending],
  }

  writeState(updatedState)
  return next
}

export function approveSubmission(submissionId, reviewerName = 'Admin') {
  const state = readState()
  const pendingItem = state.pending.find((item) => item.id === submissionId)

  if (!pendingItem) {
    throw new Error('Pending submission not found')
  }

  const approvedItem = normalizeSubmission(pendingItem, {
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: reviewerName,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName,
  })

  const updatedState = {
    pending: state.pending.filter((item) => item.id !== submissionId),
    approved: [approvedItem, ...state.approved],
  }

  writeState(updatedState)
  return approvedItem
}

export function rejectSubmission(submissionId, reviewerName = 'Admin') {
  const state = readState()
  const rejectedItem = state.pending.find((item) => item.id === submissionId)

  if (!rejectedItem) {
    throw new Error('Pending submission not found')
  }

  const updatedState = {
    pending: state.pending.filter((item) => item.id !== submissionId),
    approved: state.approved,
  }

  writeState(updatedState)

  return normalizeSubmission(rejectedItem, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName,
  })
}

export function clearModerationState() {
  if (!hasWindow()) return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: null }))
}

export function subscribeToModerationChanges(callback) {
  if (!hasWindow()) {
    return () => {}
  }

  const handler = (event) => {
    if (event.key === STORAGE_KEY) {
      callback(readState())
    }
  }

  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export default {
  getModerationState,
  getPendingSubmissions,
  getApprovedSubmissions,
  createPendingSubmission,
  approveSubmission,
  rejectSubmission,
  clearModerationState,
  subscribeToModerationChanges,
}