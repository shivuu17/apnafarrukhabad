import { useCallback, useState } from 'react'
import { Input, TextArea } from './ui/FormInputs'
import { Button } from './ui/Button'
import useAuth from '../hooks/useAuth'
import * as feedbackService from '../services/feedback.service'

export default function FeedbackForm({ onSubmitted, initialPagePath = '' }) {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = useCallback(async (ev) => {
    ev && ev.preventDefault()
    setError('')
    if (!message.trim()) {
      setError('Please enter your feedback')
      return
    }

    setLoading(true)
    try {
      await feedbackService.createFeedbackEntry({
        name: name || (user && user.name) || 'Anonymous',
        email: email || (user && user.email) || '',
        message,
        rating,
        userId: user?.id || '',
        pagePath: initialPagePath,
      })

      setMessage('')
      setRating(null)
      if (typeof onSubmitted === 'function') onSubmitted()
    } catch (err) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }, [name, email, message, rating, user, initialPagePath, onSubmitted])

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" />
      </div>

      <TextArea label="Feedback" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you liked or what could be improved" rows={6} />

      <div>
        <label className="block text-sm font-semibold mb-2">Rating (optional)</label>
        <div className="flex items-center gap-2">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} className={`px-3 py-1 rounded-lg border ${rating===n ? 'bg-green-600 text-white' : 'bg-white text-slate-700'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={loading}>Send Feedback</Button>
      </div>
    </form>
  )
}
