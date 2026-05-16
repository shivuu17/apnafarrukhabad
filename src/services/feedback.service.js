import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebaseClient'

const STORAGE_KEY = 'af_feedback_v1'
const FIRESTORE_COLLECTION = 'feedback'

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function generateId(prefix = 'feedback') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeText(value, fallback = '') {
  const next = String(value || '').trim()
  return next || fallback
}

function toMillis(value) {
  if (value instanceof Timestamp) return value.toMillis()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

function sortNewestFirst(entries = []) {
  return [...entries].sort((left, right) => toMillis(right.createdAt) - toMillis(left.createdAt))
}

function readLocalState() {
  if (!hasWindow()) {
    return { entries: [] }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [] }

    const parsed = JSON.parse(raw)
    return {
      entries: Array.isArray(parsed.entries) ? sortNewestFirst(parsed.entries) : [],
    }
  } catch {
    return { entries: [] }
  }
}

function writeLocalState(nextState) {
  if (!hasWindow()) return nextState

  const serialized = JSON.stringify({ entries: sortNewestFirst(nextState.entries || []) })
  window.localStorage.setItem(STORAGE_KEY, serialized)
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: serialized }))
  return nextState
}

function normalizeFeedbackEntry(entry = {}, overrides = {}) {
  const ratingValue = Number(entry.rating)
  const rating = Number.isFinite(ratingValue) && ratingValue >= 1 && ratingValue <= 5 ? Math.round(ratingValue) : null

  return {
    id: entry.id || generateId(),
    userId: entry.userId || '',
    name: normalizeText(entry.name, 'Anonymous'),
    email: normalizeText(entry.email, ''),
    message: normalizeText(entry.message),
    rating,
    pagePath: normalizeText(entry.pagePath, ''),
    source: normalizeText(entry.source, 'footer-feedback'),
    status: overrides.status || entry.status || 'new',
    createdAt: overrides.createdAt || entry.createdAt || new Date().toISOString(),
    reviewedAt: overrides.reviewedAt || entry.reviewedAt || null,
    reviewedBy: overrides.reviewedBy || entry.reviewedBy || null,
  }
}

function serializeFeedbackDoc(snapshotDoc) {
  const data = snapshotDoc.data() || {}
  return {
    ...data,
    id: snapshotDoc.id,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    reviewedAt: data.reviewedAt instanceof Timestamp ? data.reviewedAt.toDate().toISOString() : data.reviewedAt,
  }
}

async function readState() {
  const currentUser = getFirebaseAuth().currentUser
  if (!currentUser) {
    return readLocalState()
  }

  try {
    const db = getFirebaseDb()
    const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION))
    const entries = []

    snapshot.forEach((snapshotDoc) => {
      entries.push(serializeFeedbackDoc(snapshotDoc))
    })

    return { entries: sortNewestFirst(entries) }
  } catch (error) {
    console.warn('Failed to read feedback from Firebase, falling back to localStorage:', error)
    return readLocalState()
  }
}

export async function getFeedbackState() {
  return readState()
}

export async function getFeedbackEntries() {
  const state = await readState()
  return state.entries || []
}

export async function createFeedbackEntry(payload) {
  const next = normalizeFeedbackEntry(payload)
  if (!next.message) {
    throw new Error('Feedback message is required')
  }

  try {
    const db = getFirebaseDb()
    const docRef = doc(db, FIRESTORE_COLLECTION, next.id)

    await setDoc(docRef, {
      ...next,
      createdAt: Timestamp.fromDate(new Date(next.createdAt)),
    })

    return next
  } catch (error) {
    console.warn('Failed to create feedback in Firebase, falling back to localStorage:', error)

    const state = readLocalState()
    const updatedState = {
      entries: [next, ...state.entries],
    }

    writeLocalState(updatedState)
    return next
  }
}

export async function deleteFeedbackEntry(entryId) {
  try {
    const db = getFirebaseDb()
    await deleteDoc(doc(db, FIRESTORE_COLLECTION, entryId))
    return true
  } catch (error) {
    console.warn('Failed to delete feedback in Firebase, falling back to localStorage:', error)

    const state = readLocalState()
    writeLocalState({
      entries: state.entries.filter((entry) => entry.id !== entryId),
    })
    return true
  }
}

export function clearFeedbackState() {
  if (!hasWindow()) return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: null }))
}

export function subscribeToFeedbackChanges(callback) {
  try {
    const currentUser = getFirebaseAuth().currentUser

    if (!currentUser) {
      if (!hasWindow()) {
        return () => {}
      }

      callback(readLocalState())
      const handler = (event) => {
        if (event.key === STORAGE_KEY) {
          callback(readLocalState())
        }
      }

      window.addEventListener('storage', handler)
      return () => window.removeEventListener('storage', handler)
    }

    const db = getFirebaseDb()
    const unsubscribe = onSnapshot(
      collection(db, FIRESTORE_COLLECTION),
      (snapshot) => {
        const entries = []
        snapshot.forEach((snapshotDoc) => {
          entries.push(serializeFeedbackDoc(snapshotDoc))
        })
        callback({ entries: sortNewestFirst(entries) })
      },
      (error) => {
        console.warn('Firebase feedback subscription failed, using localStorage fallback:', error)
        callback(readLocalState())
      },
    )

    return unsubscribe
  } catch (error) {
    console.warn('Firebase feedback subscription unavailable, using localStorage fallback:', error)

    if (!hasWindow()) {
      return () => {}
    }

    callback(readLocalState())
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
  getFeedbackState,
  getFeedbackEntries,
  createFeedbackEntry,
  deleteFeedbackEntry,
  clearFeedbackState,
  subscribeToFeedbackChanges,
}