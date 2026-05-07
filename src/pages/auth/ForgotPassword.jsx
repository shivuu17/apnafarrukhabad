import React from 'react'
import { Input } from '../../components/ui/FormInputs'
import { Button } from '../../components/ui/Button'
import * as authService from '../../services/auth.service'
import { useToast } from '../../contexts/ToastContext'
import CommonPageShell from '../../components/CommonPageShell'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ email: z.string().email('Enter a valid email') })

export default function ForgotPassword() {
  const { showToast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(values)
      showToast('If an account exists, a reset email was sent', 'success')
    } catch (err) {
      showToast(err.message || 'Reset failed', 'error')
    }
  }

  return (
    <CommonPageShell title="Reset Password" subtitle="Request a reset link for your account">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth size="md" loading={isSubmitting}>
              Send reset link
            </Button>
          </div>
        </form>
      </div>
    </CommonPageShell>
  )
}
