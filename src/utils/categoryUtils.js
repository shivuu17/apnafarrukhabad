const CATEGORY_ALIASES = {
  agriculture: 'agriculture',
  farming: 'agriculture',
  health: 'health',
  education: 'education',
  business: 'business',
  sports: 'sports',
  government: 'government',
  govt: 'government',
  govtschemes: 'government',
  scheme: 'government',
  schemes: 'government',
  mandirates: 'commodities',
  commodities: 'commodities',
  commodity: 'commodities',
  weather: 'weather',
  infrastructure: 'infrastructure',
  other: 'other',
}

export const CATEGORY_META = {
  agriculture: { label: 'Agriculture', title: 'Agriculture', subtitle: 'Live farming updates and crop news', icon: '🌾', color: 'from-green-50 to-emerald-50' },
  health: { label: 'Health', title: 'Health', subtitle: 'Health camps, alerts, and service notices', icon: '⚕️', color: 'from-blue-50 to-sky-50' },
  education: { label: 'Education', title: 'Education', subtitle: 'School news, exams, and learning updates', icon: '📚', color: 'from-yellow-50 to-amber-50' },
  business: { label: 'Business', title: 'Business', subtitle: 'Local shops, services, and market movement', icon: '💼', color: 'from-purple-50 to-indigo-50' },
  sports: { label: 'Sports', title: 'Sports', subtitle: 'Matches, tournaments, and youth activities', icon: '⚽', color: 'from-red-50 to-rose-50' },
  government: { label: 'Government Schemes', title: 'Government Schemes', subtitle: 'Policy updates, announcements, and public notices', icon: '🏛️', color: 'from-orange-50 to-amber-50' },
  commodities: { label: 'Mandi Rates', title: 'Mandi Rates', subtitle: 'Market prices, trading updates, and commodity news', icon: '💹', color: 'from-cyan-50 to-blue-50' },
  weather: { label: 'Weather', title: 'Weather', subtitle: 'Forecasts, rain alerts, and climate advisories', icon: '🌤️', color: 'from-teal-50 to-cyan-50' },
  infrastructure: { label: 'Infrastructure', title: 'Infrastructure', subtitle: 'Roads, water, electricity, and civic updates', icon: '🏗️', color: 'from-slate-50 to-slate-100' },
  other: { label: 'Other', title: 'Other', subtitle: 'General local news and community updates', icon: '🗂️', color: 'from-slate-50 to-slate-100' },
}

export function normalizeCategory(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z]/g, '')
  return CATEGORY_ALIASES[normalized] || CATEGORY_ALIASES[String(value || '').trim().toLowerCase()] || normalized
}

export function getCategorySlugFromLabel(label) {
  return normalizeCategory(label)
}

export function getCategoryDisplay(slug) {
  return CATEGORY_META[normalizeCategory(slug)] || CATEGORY_META.other
}
