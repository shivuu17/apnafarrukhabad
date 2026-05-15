import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/FormInputs'
import { Button } from '../../components/ui/Button'
import * as authService from '../../services/auth.service'
import { useToast } from '../../contexts/ToastContext'
import CommonPageShell from '../../components/CommonPageShell'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, Mail, CheckCircle2 } from 'lucide-react'

const schema = z.object({ email: z.string().email('Enter a valid email') })

export default function ForgotPassword() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(values)
      setSubmitted(true)
      showToast('Password reset link sent to your email', 'success')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      showToast(err.message || 'Reset failed', 'error')
    }
  }

  if (submitted) {
    return (
      <CommonPageShell title="Check Your Email" subtitle="Password reset link has been sent">
        <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-soft text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={48} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold text-emerald-900">Check your email</h2>
          <p className="mt-3 text-sm text-emerald-800">
            We've sent a password reset link to your email address. Click the link to create a new password.
          </p>
          <p className="mt-4 text-xs text-emerald-700">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button onClick={() => navigate('/login')} variant="primary" fullWidth size="md" className="mt-6">
            Back to Login
          </Button>
        </div>
      </CommonPageShell>
    )
  }

  return (
    <CommonPageShell title="Reset Password" subtitle="Enter your email to receive a reset link">
      <div className="mx-auto max-w-md">
        <button
          onClick={() => navigate('/login')}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft size={16} />
          Back to Login
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-slate-100 p-3">
              <Mail size={24} className="text-slate-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
              <p className="mt-2 text-xs text-slate-500">
                Enter the email address associated with your account
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth size="md" loading={isSubmitting}>
                Send reset link
              </Button>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <p className="text-xs text-blue-900">
                <strong>Tip:</strong> Check your spam/junk folder if you don't see the email within a few minutes.
              </p>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}
