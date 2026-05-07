import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebaseClient'

function mapUserDoc(uid, fallbackEmail, payload = {}) {
  return {
    id: uid,
    name: payload.name || 'User',
    email: payload.email || fallbackEmail || '',
    role: payload.role || 'user',
    username: payload.username || '',
    phone: payload.phone || '',
    village: payload.village || '',
    block: payload.block || '',
    district: payload.district || 'Farrukhabad',
    locationName: payload.locationName || '',
    locationType: payload.locationType || '',
    tehsil: payload.tehsil || '',
    state: payload.state || '',
    lat: payload.lat ?? null,
    lng: payload.lng ?? null,
    locationVerified: Boolean(payload.locationVerified),
    bio: payload.bio || '',
    interests: Array.isArray(payload.interests) ? payload.interests : [],
    avatar: payload.avatar || '',
    emailVerified: Boolean(payload.emailVerified),
    phoneVerified: Boolean(payload.phoneVerified),
  }
}

function normalizeUsername(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase()
}

function normalizeAuthError(error) {
  const code = error?.code || ''
  if (code === 'auth/invalid-api-key') {
    return new Error('Firebase API key is invalid. Check VITE_FIREBASE_API_KEY in .env and restart the dev server.')
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/invalid-email' || code === 'auth/user-not-found') {
    return new Error('Invalid credentials')
  }
  if (code === 'auth/email-already-in-use') {
    return new Error('Email already exists')
  }
  if (code === 'auth/weak-password') {
    return new Error('Password should be at least 6 characters')
  }
  return new Error(error?.message || 'Authentication failed')
}

export async function signUp({ name, email, password }) {
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = credential.user.uid

    await setDoc(doc(db, 'users', uid), {
      uid,
      name,
      email,
      role: 'user',
      locationName: '',
      locationType: '',
      district: 'Farrukhabad',
      tehsil: '',
      state: '',
      lat: null,
      lng: null,
      locationVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const token = await credential.user.getIdToken()
    return {
      user: { id: uid, name, email, role: 'user' },
      token,
    }
  } catch (error) {
    throw normalizeAuthError(error)
  }
}

export async function signIn({ email, password }) {
  const auth = getFirebaseAuth()
  const db = getFirebaseDb()
  let credential
  try {
    credential = await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throw normalizeAuthError(error)
  }

  const uid = credential.user.uid
  const snap = await getDoc(doc(db, 'users', uid))

  if (!snap.exists()) {
    await firebaseSignOut(auth)
    throw new Error('User not exist. Create account for login.')
  }

  const data = snap.data() || {}
  const user = mapUserDoc(uid, credential.user.email, data)
  const token = await credential.user.getIdToken()

  return { user, token }
}

export async function signOut() {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
  return { ok: true }
}

export async function getCurrentUser() {
  const auth = getFirebaseAuth()
  const db = getFirebaseDb()
  const firebaseUser = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  if (!firebaseUser) return null

  const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
  if (!snap.exists()) return null

  return mapUserDoc(firebaseUser.uid, firebaseUser.email, snap.data())
}

export async function resetPassword({ email }) {
  try {
    const auth = getFirebaseAuth()
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    throw normalizeAuthError(error)
  }
  return { ok: true }
}

export default { signIn, signUp, signOut, getCurrentUser, resetPassword, updateUserProfile, checkUsernameAvailability }

export async function updateUserProfile(uid, payload = {}) {
  try {
    const db = getFirebaseDb()
    const userRef = doc(db, 'users', uid)
    const nextPayload = { ...payload }

    if (Object.prototype.hasOwnProperty.call(nextPayload, 'username')) {
      const normalized = normalizeUsername(nextPayload.username)
      nextPayload.username = normalized
      nextPayload.usernameLower = normalized
    }

    // merge updates into existing user doc
    await setDoc(userRef, { ...nextPayload, updatedAt: serverTimestamp() }, { merge: true })
    // return the merged doc snapshot
    const snap = await getDoc(userRef)
    return mapUserDoc(uid, snap.data()?.email, snap.data() || {})
  } catch (err) {
    throw new Error(err.message || 'Failed to update profile')
  }
}

export async function checkUsernameAvailability(username, excludeUid = '') {
  const normalized = normalizeUsername(username)
  if (!normalized) return false

  const db = getFirebaseDb()
  const usersRef = collection(db, 'users')

  // Preferred indexed field for case-insensitive checks.
  const qLower = query(usersRef, where('usernameLower', '==', normalized), limit(1))
  const lowerSnap = await getDocs(qLower)
  if (!lowerSnap.empty) {
    const hit = lowerSnap.docs[0]
    return hit.id === excludeUid
  }

  // Backward compatibility: older docs may only have username.
  const qUsername = query(usersRef, where('username', '==', normalized), limit(1))
  const userSnap = await getDocs(qUsername)
  if (!userSnap.empty) {
    const hit = userSnap.docs[0]
    return hit.id === excludeUid
  }

  return true
}
