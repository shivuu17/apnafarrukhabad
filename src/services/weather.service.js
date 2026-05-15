const DEFAULT_LOCATION = {
  name: 'Farrukhabad',
  latitude: 27.3913,
  longitude: 79.5792,
}

function readEnv(key, fallback = '') {
  return String(import.meta.env[key] || fallback).trim()
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function buildFallbackUrl({ latitude, longitude, units = 'metric', language = 'en' }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code',
    hourly: 'precipitation_probability',
    timezone: 'auto',
    temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: units === 'imperial' ? 'mph' : 'kmh',
    forecast_days: '1',
    past_days: '0',
  })

  if (language) {
    params.set('language', language)
  }

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

function buildRequestUrl({ latitude, longitude, locationName, provider, apiUrl, apiKey, units, language }) {
  if (apiUrl) {
    const replaced = apiUrl
      .replaceAll('{{lat}}', String(latitude))
      .replaceAll('{{lon}}', String(longitude))
      .replaceAll('{{latitude}}', String(latitude))
      .replaceAll('{{longitude}}', String(longitude))
      .replaceAll('{{city}}', encodeURIComponent(locationName))
      .replaceAll('{{location}}', encodeURIComponent(locationName))
      .replaceAll('{{key}}', encodeURIComponent(apiKey || ''))

    return replaced
  }

  if (provider === 'openweather' || apiKey) {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      appid: apiKey,
      units: units === 'imperial' ? 'imperial' : 'metric',
      lang: language || 'en',
    })

    return `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`
  }

  return buildFallbackUrl({ latitude, longitude, units, language })
}

function normalizeWeatherPayload(payload) {
  const temperature = toNumber(
    payload?.main?.temp ??
    payload?.current?.temp_c ??
    payload?.current?.temperature ??
    payload?.current_weather?.temperature ??
    payload?.temperature
  )

  const feelsLike = toNumber(
    payload?.main?.feels_like ??
    payload?.current?.feelslike_c ??
    payload?.apparent_temperature
  )

  const humidity = toNumber(
    payload?.main?.humidity ??
    payload?.current?.humidity ??
    payload?.relative_humidity_2m
  )

  const windSpeed = toNumber(
    payload?.wind?.speed ??
    payload?.current?.wind_kph ??
    payload?.current?.wind_mph ??
    payload?.current_weather?.windspeed ??
    payload?.wind_speed_10m
  )

  const rainChance = toNumber(
    payload?.clouds?.all ??
    payload?.current?.precip_mm ??
    payload?.hourly?.precipitation_probability?.[0] ??
    payload?.precipitation_probability
  )

  const description =
    payload?.weather?.[0]?.description ??
    payload?.current?.condition?.text ??
    payload?.weather_description ??
    payload?.current_weather?.weathercode_description ??
    'Clear'

  const conditionCode = payload?.weather?.[0]?.id ?? payload?.current_weather?.weathercode ?? payload?.weather_code

  return {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    rainChance,
    description,
    conditionCode,
    city:
      payload?.name ??
      payload?.location?.name ??
      payload?.resolvedAddress ??
      payload?.timezone ??
      DEFAULT_LOCATION.name,
    updatedAt: new Date().toISOString(),
  }
}

export function getWeatherLocation() {
  return {
    name: readEnv('VITE_WEATHER_LOCATION', DEFAULT_LOCATION.name),
    latitude: toNumber(readEnv('VITE_WEATHER_LAT', DEFAULT_LOCATION.latitude)) ?? DEFAULT_LOCATION.latitude,
    longitude: toNumber(readEnv('VITE_WEATHER_LON', DEFAULT_LOCATION.longitude)) ?? DEFAULT_LOCATION.longitude,
  }
}

export async function fetchCurrentWeather() {
  const location = getWeatherLocation()
  const provider = readEnv('VITE_WEATHER_PROVIDER', 'open-meteo').toLowerCase()
  const apiUrl = readEnv('VITE_WEATHER_API_URL')
  const apiKey = readEnv('VITE_WEATHER_API_KEY')
  const units = readEnv('VITE_WEATHER_UNITS', 'metric').toLowerCase()
  const language = readEnv('VITE_WEATHER_LANGUAGE', 'en').toLowerCase()

  const requestUrl = buildRequestUrl({
    latitude: location.latitude,
    longitude: location.longitude,
    locationName: location.name,
    provider,
    apiUrl,
    apiKey,
    units,
    language,
  })

  const response = await fetch(requestUrl)
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`)
  }

  const payload = await response.json()
  return {
    ...normalizeWeatherPayload(payload),
    locationName: location.name,
  }
}

export function getWeatherDisplayIcon(description = '', code = null) {
  const normalized = String(description || '').toLowerCase()

  if (typeof code === 'number') {
    if (code === 0) return '☀️'
    if (code === 1 || code === 2) return '🌤️'
    if (code === 3) return '☁️'
    if (code >= 45 && code <= 48) return '🌫️'
    if (code >= 51 && code <= 67) return '🌧️'
    if (code >= 71 && code <= 77) return '🌨️'
    if (code >= 80 && code <= 82) return '🌦️'
    if (code >= 95) return '⛈️'
  }

  if (normalized.includes('storm') || normalized.includes('thunder')) return '⛈️'
  if (normalized.includes('rain') || normalized.includes('drizzle')) return '🌧️'
  if (normalized.includes('snow')) return '🌨️'
  if (normalized.includes('fog') || normalized.includes('mist') || normalized.includes('haze')) return '🌫️'
  if (normalized.includes('cloud')) return '☁️'
  return '🌤️'
}

export default { fetchCurrentWeather, getWeatherLocation, getWeatherDisplayIcon }