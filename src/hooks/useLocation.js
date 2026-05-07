import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildDisplayName,
  clearCachedLocation,
  detectCurrentLocation,
  findLocationMatches,
  getCachedLocation,
  getLocationPermissionState,
  normalizeLocation,
  writeCache,
} from '../services/locationService'

export default function useLocation(initialLocation = null) {
  const [cachedLocation, setCachedLocation] = useState(() => initialLocation || getCachedLocation())
  const [location, setLocation] = useState(() => initialLocation || getCachedLocation())
  const [searchQuery, setSearchQuery] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState('')
  const [permissionState, setPermissionState] = useState('prompt')

  useEffect(() => {
    let mounted = true

    getLocationPermissionState().then((state) => {
      if (mounted) setPermissionState(state)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (initialLocation) {
      const normalized = normalizeLocation(initialLocation)
      setLocation(normalized)
      setCachedLocation(normalized)
      writeCache(normalized)
    }
  }, [initialLocation])

  const detectLocation = useCallback(async () => {
    setIsDetecting(true)
    setError('')
    try {
      const detected = await detectCurrentLocation()
      const normalized = normalizeLocation(detected)
      setLocation(normalized)
      setCachedLocation(normalized)
      writeCache(normalized)
      return normalized
    } catch (err) {
      setError(err.message || 'Could not detect location')
      throw err
    } finally {
      setIsDetecting(false)
    }
  }, [])

  const confirmLocation = useCallback((nextLocation) => {
    const normalized = normalizeLocation(nextLocation)
    setLocation(normalized)
    setCachedLocation(normalized)
    writeCache(normalized)
    setSearchQuery('')
    setError('')
    return normalized
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setCachedLocation(null)
    clearCachedLocation()
  }, [])

  const matchingLocations = useMemo(() => findLocationMatches(searchQuery), [searchQuery])

  return {
    location,
    cachedLocation,
    searchQuery,
    setSearchQuery,
    detectLocation,
    confirmLocation,
    clearLocation,
    isDetecting,
    error,
    permissionState,
    matchingLocations,
    setLocation: confirmLocation,
    displayLocation: location ? buildDisplayName(location) : '',
  }
}