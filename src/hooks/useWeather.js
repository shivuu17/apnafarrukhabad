import { useEffect, useState } from 'react'
import { fetchCurrentWeather } from '../services/weather.service'

export default function useWeather({ refreshMs = 10 * 60 * 1000 } = {}) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    let timerId = null

    const loadWeather = async () => {
      try {
        if (mounted) setLoading(true)
        const nextWeather = await fetchCurrentWeather()
        if (mounted) {
          setWeather(nextWeather)
          setError('')
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Failed to load weather')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadWeather()

    if (refreshMs > 0) {
      timerId = window.setInterval(loadWeather, refreshMs)
    }

    return () => {
      mounted = false
      if (timerId) window.clearInterval(timerId)
    }
  }, [refreshMs])

  return { weather, loading, error }
}