import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebaseClient'

let recaptchaVerifier = null
let recaptchaInitPromise = null

const PHONE_AUTH_MODE = String(import.meta.env.VITE_FIREBASE_PHONE_AUTH_MODE || 'production').trim().toLowerCase()
const PHONE_AUTH_TEST_MODE = PHONE_AUTH_MODE === 'test'

export async function initializeRecaptcha(containerId = 'recaptcha-container') {
  if (recaptchaVerifier) {
    return recaptchaVerifier
  }

  if (recaptchaInitPromise) {
    return recaptchaInitPromise
  }

  recaptchaInitPromise = (async () => {
    const auth = getFirebaseAuth()

    auth.settings = auth.settings || {}
    auth.settings.appVerificationDisabledForTesting = PHONE_AUTH_TEST_MODE

    let container = document.getElementById(containerId)
    if (!container) {
      container = document.createElement('div')
      container.id = containerId
      container.style.position = 'absolute'
      container.style.left = '-10000px'
      container.style.top = '0'
      container.style.width = '1px'
      container.style.height = '1px'
      container.style.overflow = 'hidden'
      document.body.appendChild(container)
    }

    if (
      typeof window !== 'undefined' &&
      window.grecaptcha?.enterprise &&
      typeof window.grecaptcha.enterprise.ready === 'function'
    ) {
      await new Promise((resolve) => window.grecaptcha.enterprise.ready(resolve))
    }

    if (PHONE_AUTH_TEST_MODE) {
      console.log('[phone auth] test mode enabled; Firebase fictional phone numbers will bypass real reCAPTCHA')
    }

    const verifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {
        console.log('[phone auth] reCAPTCHA verified')
      },
      'expired-callback': () => {
        console.warn('[phone auth] reCAPTCHA expired')
        recaptchaVerifier = null
        recaptchaInitPromise = null
      },
      'error-callback': (error) => {
        console.error('[phone auth] reCAPTCHA error', error)
        recaptchaVerifier = null
        recaptchaInitPromise = null
      },
    })

    try {
      // If a grecaptcha widget already exists in the container, skip render to avoid
      // the "already been rendered" error. This can happen if multiple components
      // reuse the same container on hot-reload or re-mounts.
      const existing = container.querySelector('.grecaptcha-badge, .g-recaptcha')
      if (existing) {
        console.log('[phone auth] reCAPTCHA already present in DOM, skipping render')
      } else {
        await verifier.render()
      }
    } catch (err) {
      const msg = String(err?.message || '')
      if (msg.includes('already been rendered')) {
        console.warn('[phone auth] reCAPTCHA render warning:', msg)
      } else {
        throw err
      }
    }

    recaptchaVerifier = verifier
    return verifier
  })()

  try {
    return await recaptchaInitPromise
  } catch (error) {
    recaptchaVerifier = null
    throw error
  } finally {
    recaptchaInitPromise = null
  }
}

export async function sendPhoneVerificationCode(phoneNumber) {
  try {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new Error('Invalid phone number provided')
    }

    const auth = getFirebaseAuth()
    const formattedPhone = phoneNumber.trim().startsWith('+')
      ? phoneNumber.trim().replace(/[^+\d]/g, '')
      : `+91${phoneNumber.replace(/\D/g, '')}`

    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      throw new Error('Invalid phone format. Use country code, e.g. +91XXXXXXXXXX')
    }

    if (PHONE_AUTH_TEST_MODE) {
      auth.settings = auth.settings || {}
      auth.settings.appVerificationDisabledForTesting = true
    }

    const verifier = await initializeRecaptcha('recaptcha-container')
    console.log('[phone auth] sending OTP to', formattedPhone)

    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier)
    return {
      success: true,
      confirmationResult,
      message: `OTP sent to ${formattedPhone}`,
    }
  } catch (error) {
    console.error('[phone auth] send OTP error', error)

    if (error?.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number. Use format: +91XXXXXXXXXX')
    }
    if (error?.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Try again later.')
    }
    if (error?.code === 'auth/operation-not-allowed') {
      throw new Error('Phone authentication is not enabled in Firebase.')
    }
    if (error?.code === 'auth/billing-not-enabled') {
      throw new Error('Firebase billing is not enabled. Real phone authentication requires the Blaze plan. Use Firebase test phone numbers for development or enable billing in the Firebase console.')
    }
    if (error?.code === 'auth/argument-error') {
      throw new Error('reCAPTCHA initialization failed. Check Firebase config and verifier setup.')
    }

    throw new Error(error?.message || 'Failed to send OTP')
  }
}

export async function verifyPhoneCode(confirmationResult, otp, userId) {
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()

    const userCredential = await confirmationResult.confirm(String(otp).trim())
    const phoneNumber = userCredential.user.phoneNumber

    if (userId) {
      await setDoc(
        doc(db, 'users', userId),
        {
          phoneVerified: true,
          phone: phoneNumber,
          phoneVerifiedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    }

    await signOut(auth)

    return {
      success: true,
      phoneNumber,
      message: 'Phone number verified successfully',
    }
  } catch (error) {
    console.error('[phone auth] verify OTP error', error)
    if (error?.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid OTP. Please try again.')
    }
    if (error?.code === 'auth/code-expired') {
      throw new Error('Code expired. Request a new OTP.')
    }
    throw new Error(error?.message || 'Verification failed')
  }
}

export function clearRecaptcha() {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear()
    } finally {
      recaptchaVerifier = null
      recaptchaInitPromise = null
    }
  }
}
