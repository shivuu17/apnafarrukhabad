import { collection, doc, getDoc, getDocs, setDoc, query, where, onSnapshot, deleteField, Timestamp } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebaseClient'

const STORAGE_KEY = 'af_media_moderation_v1'
const FIRESTORE_COLLECTION = 'submissions'

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readLocalState() {
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

function writeLocalState(nextState) {
  if (!hasWindow()) return nextState

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(nextState) }))
  return nextState
}

async function readState({ approvedOnly = false } = {}) {
  try {
    const db = getFirebaseDb()
    const submissionsRef = collection(db, FIRESTORE_COLLECTION)
    const currentUser = getFirebaseAuth().currentUser
    const shouldReadApprovedOnly = approvedOnly || !currentUser
    const snapshot = shouldReadApprovedOnly
      ? await getDocs(query(submissionsRef, where('status', '==', 'approved')))
      : await getDocs(submissionsRef)
    
    const pending = []
    const approved = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      const submission = {
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        approvedAt: data.approvedAt instanceof Timestamp ? data.approvedAt.toDate().toISOString() : data.approvedAt,
        reviewedAt: data.reviewedAt instanceof Timestamp ? data.reviewedAt.toDate().toISOString() : data.reviewedAt,
      }
      
      if (data.status === 'approved') {
        approved.push(submission)
      } else {
        pending.push(submission)
      }
    })
    
    return { pending, approved }
  } catch (error) {
    console.warn('Failed to read from Firebase, falling back to localStorage:', error)
    return readLocalState()
  }
}

async function writeState(nextState) {
  try {
    const db = getFirebaseDb()
    
    // Write to Firebase
    for (const submission of nextState.pending) {
      const docRef = doc(db, FIRESTORE_COLLECTION, submission.id)
      await setDoc(docRef, {
        ...submission,
        status: 'pending',
        createdAt: submission.createdAt instanceof Timestamp ? submission.createdAt : Timestamp.fromDate(new Date(submission.createdAt)),
      }, { merge: true })
    }
    
    for (const submission of nextState.approved) {
      const docRef = doc(db, FIRESTORE_COLLECTION, submission.id)
      await setDoc(docRef, {
        ...submission,
        status: 'approved',
        createdAt: submission.createdAt instanceof Timestamp ? submission.createdAt : Timestamp.fromDate(new Date(submission.createdAt)),
        approvedAt: submission.approvedAt instanceof Timestamp ? submission.approvedAt : Timestamp.fromDate(new Date(submission.approvedAt)),
      }, { merge: true })
    }
  } catch (error) {
    console.warn('Failed to write to Firebase, falling back to localStorage:', error)
    writeLocalState(nextState)
  }
  
  return nextState
}

function generateId(prefix = 'submission') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeSubmission(submission, overrides = {}) {
  return {
    id: submission.id || generateId(),
    userId: submission.userId || submission.uid || '',
    avatar: submission.avatar || submission.profileImage || submission.userAvatar || '',
    title: submission.title?.trim() || '',
    description: submission.description?.trim() || '',
    email: submission.email?.trim() || submission.reporterEmail || '',
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

export async function getModerationState() {
  return readState()
}

export async function getPendingSubmissions() {
  const state = await readState()
  return state.pending
}

export async function getApprovedSubmissions() {
  const state = await readState({ approvedOnly: true })
  return state.approved
}

export async function createPendingSubmission(submission) {
  try {
    const db = getFirebaseDb()
    const next = normalizeSubmission(submission, { status: 'pending' })
    const docRef = doc(db, FIRESTORE_COLLECTION, next.id)
    
    await setDoc(docRef, {
      ...next,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date(next.createdAt)),
    })
    
    return next
  } catch (error) {
    console.warn('Failed to create submission in Firebase:', error)
    // Fallback: still store locally
    const state = readLocalState()
    const next = normalizeSubmission(submission, { status: 'pending' })
    const updatedState = {
      ...state,
      pending: [next, ...state.pending],
    }
    writeLocalState(updatedState)
    return next
  }
}

export async function approveSubmission(submissionId, reviewerName = 'Admin') {
  try {
    const db = getFirebaseDb()
    const state = await readState()
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

    const docRef = doc(db, FIRESTORE_COLLECTION, submissionId)
    await setDoc(docRef, {
      ...approvedItem,
      status: 'approved',
      approvedAt: Timestamp.fromDate(new Date(approvedItem.approvedAt)),
    }, { merge: true })

    return approvedItem
  } catch (error) {
    console.warn('Failed to approve submission in Firebase:', error)
    // Fallback to localStorage
    const state = readLocalState()
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

    writeLocalState(updatedState)
    return approvedItem
  }
}

export async function rejectSubmission(submissionId, reviewerName = 'Admin') {
  try {
    const db = getFirebaseDb()
    const state = await readState()
    const rejectedItem = state.pending.find((item) => item.id === submissionId)

    if (!rejectedItem) {
      throw new Error('Pending submission not found')
    }

    const docRef = doc(db, FIRESTORE_COLLECTION, submissionId)
    await setDoc(docRef, {
      ...rejectedItem,
      status: 'rejected',
      reviewedAt: Timestamp.fromDate(new Date()),
      reviewedBy: reviewerName,
    }, { merge: true })

    return normalizeSubmission(rejectedItem, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName,
    })
  } catch (error) {
    console.warn('Failed to reject submission in Firebase:', error)
    // Fallback to localStorage
    const state = readLocalState()
    const rejectedItem = state.pending.find((item) => item.id === submissionId)

    if (!rejectedItem) {
      throw new Error('Pending submission not found')
    }

    const updatedState = {
      pending: state.pending.filter((item) => item.id !== submissionId),
      approved: state.approved,
    }

    writeLocalState(updatedState)

    return normalizeSubmission(rejectedItem, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName,
    })
  }
}

export function clearModerationState() {
  if (!hasWindow()) return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: null }))
}

export function subscribeToModerationChanges(callback) {
  try {
    const db = getFirebaseDb()
    const submissionsRef = collection(db, FIRESTORE_COLLECTION)
    const currentUser = getFirebaseAuth().currentUser
    const watchedQuery = currentUser
      ? submissionsRef
      : query(submissionsRef, where('status', '==', 'approved'))

    const unsubscribe = onSnapshot(watchedQuery, (snapshot) => {
      const pending = []
      const approved = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        const submission = {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          approvedAt: data.approvedAt instanceof Timestamp ? data.approvedAt.toDate().toISOString() : data.approvedAt,
          reviewedAt: data.reviewedAt instanceof Timestamp ? data.reviewedAt.toDate().toISOString() : data.reviewedAt,
        }
        
        if (data.status === 'approved') {
          approved.push(submission)
        } else {
          pending.push(submission)
        }
      })
      
      callback({ pending, approved })
    })
    
    return unsubscribe
  } catch (error) {
    console.warn('Firebase subscription failed, using localStorage:', error)
    // Fallback with localStorage events
    if (!hasWindow()) {
      return () => {}
    }

    const handler = (event) => {
      if (event.key === STORAGE_KEY) {
        callback(readLocalState())
      }
    }

    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }
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