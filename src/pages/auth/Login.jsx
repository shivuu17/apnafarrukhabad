import React from 'react'
import { Input } from '../../components/ui/FormInputs'
import { Button } from '../../components/ui/Button'
import useAuth from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CommonPageShell from '../../components/CommonPageShell'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      const result = await login(values)
      showToast('Logged in successfully', 'success')
      
      // Check if profile is completed
      if (!result.user?.profileCompleted) {
        // Profile not completed, redirect to onboarding
        navigate('/onboarding')
      } else {
        // Profile completed, redirect to previous page or home
        const next = searchParams.get('next')
        navigate(next || '/')
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error')
    }
  }

  return (
    <CommonPageShell title="Sign In" subtitle="Access your account to post, save, and manage updates">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />

          <Input label="Password" type="password" placeholder="Your password" {...register('password')} error={errors.password?.message} />

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth size="md" loading={isSubmitting}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </CommonPageShell>
  )
}
