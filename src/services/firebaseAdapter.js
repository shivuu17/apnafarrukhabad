import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdTokenResult,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebaseClient'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizeUsername(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase()
}

function normalizeRoleValue(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '')
}

function parseAdminEmails() {
  const raw = String(import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || '').trim()
  if (!raw) return []

  return raw
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function resolveRole({ role, email, claims = {} }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const adminEmails = parseAdminEmails()
  const hasAdminClaim = Boolean(
    claims.admin || claims.isAdmin || ['admin', 'superadmin', 'moderator'].includes(normalizeRoleValue(claims.role)),
  )
  const isConfiguredAdmin = normalizedEmail && adminEmails.includes(normalizedEmail)
  const normalizedRole = normalizeRoleValue(role)

  if (normalizedRole === 'admin' || normalizedRole === 'superadmin' || normalizedRole === 'moderator' || hasAdminClaim || isConfiguredAdmin) {
    return 'admin'
  }

  return normalizedRole || 'user'
}

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
    profileCompleted: Boolean(payload.profileCompleted),
  }
}

function buildFirebaseUserProfile(firebaseUser, claims = {}) {
  const fallbackRole = resolveRole({ role: firebaseUser?.role, email: firebaseUser?.email, claims })

  return mapUserDoc(firebaseUser.uid, firebaseUser.email, {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')?.[0] || 'User',
    email: firebaseUser.email || '',
    role: fallbackRole,
    emailVerified: Boolean(firebaseUser.emailVerified),
    avatar: firebaseUser.photoURL || '',
  })
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

function usernameRegistryRef(db, username) {
  return doc(db, 'usernameRegistry', normalizeUsername(username))
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
      profileCompleted: false,
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
  const tokenResult = await getIdTokenResult(credential.user)
  const claims = tokenResult?.claims || {}

  const data = snap.exists() ? (snap.data() || {}) : {}
  const user = snap.exists()
    ? mapUserDoc(uid, credential.user.email, {
      ...data,
      role: resolveRole({ role: data.role, email: credential.user.email, claims }),
    })
    : buildFirebaseUserProfile(credential.user, claims)
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
  const tokenResult = await getIdTokenResult(firebaseUser)
  const claims = tokenResult?.claims || {}

  if (!snap.exists()) {
    return buildFirebaseUserProfile(firebaseUser, claims)
  }

  return mapUserDoc(firebaseUser.uid, firebaseUser.email, {
    ...snap.data(),
    role: resolveRole({ role: snap.data()?.role, email: firebaseUser.email, claims }),
  })
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

export async function deleteAccount(password, reason) {
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    const user = auth.currentUser

    if (!user) {
      throw new Error('No user logged in')
    }

    // Verify password by re-authenticating
    try {
      await signInWithEmailAndPassword(auth, user.email, password)
    } catch (error) {
      throw new Error('Invalid password')
    }

    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, { deletedAt: serverTimestamp(), deletionReason: reason }, { merge: true })

    await user.delete()
    await firebaseSignOut(auth)

    return { success: true }
  } catch (err) {
    throw new Error(err.message || 'Failed to delete account')
  }
}

export async function updateUserProfile(uid, payload = {}) {
  try {
    const db = getFirebaseDb()
    const userRef = doc(db, 'users', uid)
    const nextPayload = { ...payload, uid }
    const hasUsername = Object.prototype.hasOwnProperty.call(nextPayload, 'username')
    const nextUsername = hasUsername ? normalizeUsername(nextPayload.username) : ''

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef)
      const currentData = userSnap.exists() ? (userSnap.data() || {}) : {}
      const currentUsername = normalizeUsername(currentData.username || currentData.usernameLower || '')

      if (hasUsername) {
        nextPayload.username = nextUsername
        nextPayload.usernameLower = nextUsername

        if (nextUsername && nextUsername !== currentUsername) {
          const registrySnap = await transaction.get(usernameRegistryRef(db, nextUsername))
          if (registrySnap.exists() && registrySnap.data()?.uid !== uid) {
            throw new Error('Username already taken')
          }

          if (currentUsername && currentUsername !== nextUsername) {
            const currentRegistrySnap = await transaction.get(usernameRegistryRef(db, currentUsername))
            if (currentRegistrySnap.exists() && currentRegistrySnap.data()?.uid === uid) {
              transaction.delete(usernameRegistryRef(db, currentUsername))
            }
          }

          transaction.set(usernameRegistryRef(db, nextUsername), {
            uid,
            username: nextUsername,
            usernameLower: nextUsername,
            updatedAt: serverTimestamp(),
          }, { merge: true })
        }
      }

      transaction.set(userRef, { ...nextPayload, updatedAt: serverTimestamp() }, { merge: true })
    })

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
  const snap = await getDoc(usernameRegistryRef(db, normalized))
  if (!snap.exists()) return true

  return snap.data()?.uid === excludeUid
}

export async function syncUsernameRegistry(uid, username) {
  const normalized = normalizeUsername(username)
  if (!uid || !normalized) return false

  const db = getFirebaseDb()
  const userRef = doc(db, 'users', uid)
  const registryRef = usernameRegistryRef(db, normalized)

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef)
    const currentData = userSnap.exists() ? (userSnap.data() || {}) : {}
    const currentUsername = normalizeUsername(currentData.username || currentData.usernameLower || '')

    const existingRegistrySnap = await transaction.get(registryRef)
    if (existingRegistrySnap.exists() && existingRegistrySnap.data()?.uid !== uid) {
      throw new Error('Username already taken')
    }

    if (currentUsername && currentUsername !== normalized) {
      const currentRegistrySnap = await transaction.get(usernameRegistryRef(db, currentUsername))
      if (currentRegistrySnap.exists() && currentRegistrySnap.data()?.uid === uid) {
        transaction.delete(usernameRegistryRef(db, currentUsername))
      }
    }

    transaction.set(registryRef, {
      uid,
      username: normalized,
      usernameLower: normalized,
      updatedAt: serverTimestamp(),
    }, { merge: true })
  })

  return true
}

export async function sendEmailVerificationCode(email) {
  try {
    const auth = getFirebaseAuth()

    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Please log in again to send verification email.')
    }

    if (email && currentUser.email && String(currentUser.email).toLowerCase() !== String(email).toLowerCase()) {
      throw new Error('Logged in account email does not match profile email. Please log in with the same email.')
    }

    await firebaseSendEmailVerification(currentUser)
    return { success: true, message: 'Verification link sent to your email' }
  } catch (error) {
    throw new Error(error.message || 'Failed to send verification code')
  }
}

export async function verifyEmailCode(email, otp, userId) {
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    const currentUser = auth.currentUser

    if (!currentUser) {
      throw new Error('Please log in again to verify email status.')
    }

    await currentUser.reload()
    if (!currentUser.emailVerified) {
      throw new Error('Email not verified yet. Please click the link in your inbox, then try again.')
    }

    if (userId) {
      await setDoc(doc(db, 'users', userId), {
        emailVerified: true,
        email: currentUser.email || email,
        updatedAt: serverTimestamp(),
      }, { merge: true })
    }

    return { success: true, message: 'Email verified successfully' }
  } catch (error) {
    throw new Error(error.message || 'Verification failed')
  }
}

export async function sendPhoneVerificationCode(phone, userId) {
  try {
    const db = getFirebaseDb()
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const verificationRef = doc(db, 'phoneVerifications', phone)
    await setDoc(verificationRef, {
      phone,
      userId,
      otp,
      expiresAt: Timestamp.fromDate(expiresAt),
      attempts: 0,
      createdAt: serverTimestamp(),
    }, { merge: true })

    console.log(`Phone verification OTP for ${phone}: ${otp}`)

    return { success: true, message: 'Verification code sent to your phone' }
  } catch (error) {
    throw new Error(error.message || 'Failed to send verification code')
  }
}

export async function verifyPhoneCode(phone, otp, userId) {
  try {
    const db = getFirebaseDb()
    const verificationRef = doc(db, 'phoneVerifications', phone)
    const snap = await getDoc(verificationRef)

    if (!snap.exists()) {
      throw new Error('No verification code found')
    }

    const data = snap.data()
    const expiresAt = data.expiresAt.toDate()

    if (new Date() > expiresAt) {
      throw new Error('Verification code expired')
    }

    if (data.otp !== otp) {
      throw new Error('Invalid verification code')
    }

    if (userId) {
      await setDoc(doc(db, 'users', userId), {
        phoneVerified: true,
        phone,
        updatedAt: serverTimestamp(),
      }, { merge: true })
    }

    await setDoc(verificationRef, { otp: null, expiresAt: null }, { merge: true })

    return { success: true, message: 'Phone verified successfully' }
  } catch (error) {
    throw new Error(error.message || 'Verification failed')
  }
}

export default {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  resetPassword,
  updateUserProfile,
  checkUsernameAvailability,
  syncUsernameRegistry,
  deleteAccount,
  sendEmailVerificationCode,
  verifyEmailCode,
  sendPhoneVerificationCode,
  verifyPhoneCode,
}
