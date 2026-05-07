const CACHE_KEY = 'userLocation'
const CACHE_TS_KEY = 'userLocationUpdatedAt'
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

const MASTER_LOCATIONS = [
  { name: 'Usman Ganj', type: 'Village', district: 'Farrukhabad', tehsil: 'Farrukhabad', state: 'Uttar Pradesh', lat: 27.4012, lng: 79.5764 },
  { name: 'Kayamganj', type: 'Town', district: 'Farrukhabad', tehsil: 'Kayamganj', state: 'Uttar Pradesh', lat: 27.2628, lng: 79.3191 },
  { name: 'Amritpur', type: 'Town', district: 'Farrukhabad', tehsil: 'Amritpur', state: 'Uttar Pradesh', lat: 27.2987, lng: 79.4885 },
  { name: 'Mohammadabad', type: 'Town', district: 'Farrukhabad', tehsil: 'Mohammadabad', state: 'Uttar Pradesh', lat: 27.5962, lng: 79.7451 },
  { name: 'Pakhna', type: 'Village', district: 'Farrukhabad', tehsil: 'Farrukhabad', state: 'Uttar Pradesh', lat: 27.4157, lng: 79.6112 },
  { name: 'Fatehgarh', type: 'Town', district: 'Farrukhabad', tehsil: 'Farrukhabad', state: 'Uttar Pradesh', lat: 27.3639, lng: 79.6299 },
  { name: 'Kamalganj', type: 'Town', district: 'Farrukhabad', tehsil: 'Kamalganj', state: 'Uttar Pradesh', lat: 27.1794, lng: 79.7953 },
]

function hasWindow() {
  return typeof window !== 'undefined'
}

function roundCoord(value) {
  const next = Number(value)
  if (Number.isNaN(next)) return null
  return Number(next.toFixed(4))
}

function normalizeLocation(location = {}) {
  const lat = roundCoord(location.lat)
  const lng = roundCoord(location.lng)
  const name = String(location.name || '').trim()
  const type = String(location.type || 'Village').trim() || 'Village'
  const district = String(location.district || 'Farrukhabad').trim() || 'Farrukhabad'
  const tehsil = String(location.tehsil || district).trim() || district
  const state = String(location.state || 'Uttar Pradesh').trim() || 'Uttar Pradesh'

  return {
    name,
    type,
    district,
    tehsil,
    state,
    lat,
    lng,
  }
}

function readCache() {
  if (!hasWindow()) return null

  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    const tsRaw = window.localStorage.getItem(CACHE_TS_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const updatedAt = Number(tsRaw || 0)
    if (updatedAt && Date.now() - updatedAt > CACHE_MAX_AGE_MS) {
      return null
    }

    return normalizeLocation(parsed)
  } catch {
    return null
  }
}

function writeCache(location) {
  if (!hasWindow()) return location

  const normalized = normalizeLocation(location)
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(normalized))
  window.localStorage.setItem(CACHE_TS_KEY, String(Date.now()))
  return normalized
}

function buildDisplayName(location) {
  if (!location) return ''
  const name = location.name || ''
  const district = location.district || 'Farrukhabad'
  return `${name}${district ? `, ${district}` : ''}`
}

function findLocationMatches(query) {
  const needle = String(query || '').trim().toLowerCase()
  if (!needle) return MASTER_LOCATIONS

  return MASTER_LOCATIONS.filter((item) => {
    return [item.name, item.type, item.district, item.tehsil, item.state]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(needle))
  })
}

async function reverseGeocode(lat, lng) {
  const normalizedLat = roundCoord(lat)
  const normalizedLng = roundCoord(lng)

  if (normalizedLat === null || normalizedLng === null) {
    throw new Error('Invalid coordinates')
  }

  const cacheHit = MASTER_LOCATIONS.find((item) => {
    return Math.abs(Number(item.lat) - normalizedLat) < 0.01 && Math.abs(Number(item.lng) - normalizedLng) < 0.01
  })
  if (cacheHit) return normalizeLocation(cacheHit)

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(normalizedLat)}&lon=${encodeURIComponent(normalizedLng)}&zoom=18&addressdetails=1`
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en',
    },
  })

  if (!response.ok) {
    throw new Error('Unable to detect location right now')
  }

  const payload = await response.json()
  const address = payload?.address || {}

  const name = address.village || address.town || address.city || address.hamlet || address.suburb || payload?.name || payload?.display_name?.split(',')?.[0] || 'Detected Location'
  const district = address.county || address.district || address.state_district || 'Farrukhabad'
  const tehsil = address.town || address.city || address.suburb || district
  const state = address.state || 'Uttar Pradesh'

  return normalizeLocation({
    name,
    type: address.village ? 'Village' : 'Town',
    district,
    tehsil,
    state,
    lat: normalizedLat,
    lng: normalizedLng,
  })
}

function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!hasWindow() || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 1000 * 60 * 10,
      ...options,
    })
  })
}

function permissionSupported() {
  return hasWindow() && typeof navigator !== 'undefined' && !!navigator.permissions?.query
}

async function getLocationPermissionState() {
  if (!permissionSupported()) return 'prompt'
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state
  } catch {
    return 'prompt'
  }
}

async function detectCurrentLocation() {
  const position = await getCurrentPosition()
  const coords = position?.coords || {}
  return reverseGeocode(coords.latitude, coords.longitude)
}

function getCachedLocation() {
  return readCache()
}

function clearCachedLocation() {
  if (!hasWindow()) return
  window.localStorage.removeItem(CACHE_KEY)
  window.localStorage.removeItem(CACHE_TS_KEY)
}

export {
  CACHE_KEY,
  MASTER_LOCATIONS,
  buildDisplayName,
  clearCachedLocation,
  detectCurrentLocation,
  findLocationMatches,
  getCachedLocation,
  getCurrentPosition,
  getLocationPermissionState,
  normalizeLocation,
  reverseGeocode,
  writeCache,
}

export default {
  MASTER_LOCATIONS,
  buildDisplayName,
  clearCachedLocation,
  detectCurrentLocation,
  findLocationMatches,
  getCachedLocation,
  getCurrentPosition,
  getLocationPermissionState,
  normalizeLocation,
  reverseGeocode,
  writeCache,
}