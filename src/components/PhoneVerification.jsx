import React, { useEffect, useRef, useState } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { getFirebaseAuth } from '../services/firebaseClient'

export default function PhoneVerification({ onSuccess } = {}) {
  const auth = getFirebaseAuth()
  const recaptchaVerifierRef = useRef(null)
  const confirmationResultRef = useRef(null)
  const containerRef = useRef(null)
  const initPromiseRef = useRef(null)
  const mountedRef = useRef(false)

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    mountedRef.current = true

    const initRecaptcha = async () => {
      if (recaptchaVerifierRef.current || initPromiseRef.current || !containerRef.current) return

      initPromiseRef.current = (async () => {
        try {
          console.log('[PhoneVerification] initializing reCAPTCHA')

          if (window?.grecaptcha?.enterprise?.ready) {
            await new Promise((resolve) => window.grecaptcha.enterprise.ready(resolve))
          }

          const verifier = new RecaptchaVerifier(auth, containerRef.current, {
            size: 'invisible',
            callback: () => {
              console.log('[PhoneVerification] reCAPTCHA solved')
            },
            'expired-callback': () => {
              console.warn('[PhoneVerification] reCAPTCHA expired')
            },
          })

          await verifier.render()
          recaptchaVerifierRef.current = verifier
          console.log('[PhoneVerification] reCAPTCHA ready')
        } catch (err) {
          console.error('[PhoneVerification] reCAPTCHA init error', err)
          throw err
        } finally {
          initPromiseRef.current = null
        }
      })()

      await initPromiseRef.current
    }

    initRecaptcha().catch((err) => {
      if (mountedRef.current) {
        setError(err?.message || 'reCAPTCHA initialization failed')
      }
    })

    return () => {
      mountedRef.current = false
      try {
        recaptchaVerifierRef.current?.clear()
      } catch (err) {
        console.warn('[PhoneVerification] reCAPTCHA clear error', err)
      } finally {
        recaptchaVerifierRef.current = null
        confirmationResultRef.current = null
      }
    }
  }, [auth])

  const normalizePhone = (value) => {
    const input = String(value || '').trim()
    if (!input) return ''
    if (input.startsWith('+')) return input.replace(/[^+\d]/g, '')
    const digits = input.replace(/\D/g, '')
    return digits.length === 10 ? `+91${digits}` : `+${digits}`
  }

  const sendOtp = async () => {
    setError('')
    setMessage('')

    const phoneNumber = normalizePhone(phone)
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      setError('Enter a valid phone number with country code')
      return
    }

    try {
      setSending(true)

      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA is not ready. Please reload and try again.')
      }

      console.log('[PhoneVerification] sending OTP to', phoneNumber)
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current)
      confirmationResultRef.current = confirmationResult

      setCodeSent(true)
      setMessage(`OTP sent to ${phoneNumber}`)
    } catch (err) {
      console.error('[PhoneVerification] send OTP error', err)
      setError(err?.message || 'Failed to send OTP')
    } finally {
      if (mountedRef.current) setSending(false)
    }
  }

  const verifyOtp = async () => {
    setError('')
    setMessage('')

    if (!confirmationResultRef.current) {
      setError('Request an OTP first')
      return
    }

    if (!/^\d{4,6}$/.test(otp)) {
      setError('Enter a valid OTP')
      return
    }

    try {
      setVerifying(true)
      console.log('[PhoneVerification] verifying OTP')
      const result = await confirmationResultRef.current.confirm(otp)
      console.log('[PhoneVerification] phone verified', result?.user?.phoneNumber)

      setMessage('Phone verified successfully')
      setCodeSent(false)
      setPhone('')
      setOtp('')
      confirmationResultRef.current = null

      if (typeof onSuccess === 'function') onSuccess(result)
    } catch (err) {
      console.error('[PhoneVerification] verify OTP error', err)
      if (err?.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code')
      } else if (err?.code === 'auth/code-expired') {
        setError('Code expired. Request a new OTP.')
      } else {
        setError(err?.message || 'Verification failed')
      }
    } finally {
      if (mountedRef.current) setVerifying(false)
    }
  }

  return (
    <div>
      <div ref={containerRef} id="recaptcha-container" />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        autoComplete="tel"
      />

      <button type="button" onClick={sendOtp} disabled={sending}>
        {sending ? 'Sending...' : 'Send OTP'}
      </button>

      {codeSent && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            inputMode="numeric"
            autoComplete="one-time-code"
          />

          <button type="button" onClick={verifyOtp} disabled={verifying}>
            {verifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </div>
  )
}
