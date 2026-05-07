import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileNav from '../components/MobileNav'
import SectionHeader from '../components/SectionHeader'
import { useLanguage } from '../contexts/LanguageContext'

function Villages() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const selectedVillage = searchParams.get('village') || 'farrukhabad'
  
  const villages = [
    { id: 1, name: 'फर्रुखाबाद', slug: 'farrukhabad', population: '2.5 लाख', stories: 156, alerts: '2 सक्रिय' },
    { id: 2, name: 'खेतपुर', slug: 'khetpur', population: '45,000', stories: 89, alerts: '1 सक्रिय' },
    { id: 3, name: 'नई बस्ती', slug: 'nai-basti', population: '32,000', stories: 67, alerts: 'शांत' },
    { id: 4, name: 'मोहम्मदपुर', slug: 'mohammadpur', population: '28,500', stories: 54, alerts: 'शांत' },
    { id: 5, name: 'रायपुर', slug: 'raipur', population: '35,000', stories: 71, alerts: 'शांत' },
    { id: 6, name: 'गंगाखेड़ा', slug: 'gangakheda', population: '22,000', stories: 41, alerts: '1 सक्रिय' },
    { id: 7, name: 'सदारपुर', slug: 'sadarpur', population: '18,500', stories: 35, alerts: 'शांत' },
    { id: 8, name: 'साहपुर', slug: 'sahpur', population: '26,000', stories: 48, alerts: 'शांत' },
  ]

  const villageNews = {
    farrukhabad: [
      'किसानों को नई सिंचाई सहायता मिली',
      'बाजार में आज मंडी भाव स्थिर रहे',
      'गांव की सड़क मरम्मत का काम शुरू हुआ',
    ],
    khetpur: [
      'खेतपुर में बिजली आपूर्ति बहाल',
      'धान की फसल पर विशेषज्ञों की सलाह',
      'आज शाम पंचायत बैठक आयोजित होगी',
    ],
    'nai-basti': [
      'नई बस्ती में स्वास्थ्य शिविर सफल रहा',
      'पेयजल समस्या पर अधिकारियों का दौरा',
      'स्थानीय युवाओं ने स्वच्छता अभियान चलाया',
    ],
    mohammadpur: [
      'मोहम्मदपुर में सड़क किनारे नाली सफाई',
      'विद्यालय में नामांकन अभियान जारी',
      'किसानों को मौसम अलर्ट जारी',
    ],
    raipur: [
      'रायपुर में ग्रामीण खेल प्रतियोगिता शुरू',
      'फसल बीमा पर जागरूकता कार्यक्रम',
      'आज दोपहर तक बारिश की संभावना',
    ],
    gangakheda: [
      'गंगाखेड़ा में ट्रांसफार्मर मरम्मत जारी',
      'स्थानीय बाजार में खरीदारी तेज',
      'पंचायत ने विकास कार्यों की सूची जारी की',
    ],
    sadarpur: [
      'सदारपुर में स्व-सहायता समूह की बैठक',
      'नदी किनारे सफाई अभियान संपन्न',
      'महिलाओं के लिए स्वास्थ्य जांच कैम्प',
    ],
    sahpur: [
      'साहपुर में खेतों में नमी की स्थिति ठीक',
      'ग्राम चौपाल में शिकायतें दर्ज हुईं',
      'युवा क्लब ने पुस्तक वितरण किया',
    ],
  }

  const selectedVillageInfo = villages.find((village) => village.slug === selectedVillage) || villages[0]
  const currentNews = useMemo(() => villageNews[selectedVillageInfo.slug] || villageNews.farrukhabad, [selectedVillageInfo.slug])

  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-6 sm:pb-8">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={t('findVillages')} subtitle={t('allVillages')} />

          <div className="mb-8 sm:mb-10 rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Selected Village</p>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black text-navy-900">{selectedVillageInfo.name}</h3>
            <p className="mt-2 text-sm sm:text-base leading-6 text-slate-600">Tap a village from the top menu to load its latest local news here.</p>
            <div className="mt-5 sm:mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentNews.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="rounded-xl border border-slate-200 bg-[#f7f8f4] p-4"
                >
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {villages.map((village, index) => (
              <motion.button
                key={village.id}
                onClick={() => navigate(`/villages?village=${encodeURIComponent(village.slug)}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-navy-900 sm:text-lg">{village.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">📍 {village.population}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    village.alerts === 'शांत' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {village.alerts}
                  </span>
                </div>
                <div className="mt-3 flex gap-3 text-xs font-semibold">
                  <span className="rounded-lg bg-agri-50 px-2 py-1 text-agri-700">{village.stories} {t('stories')}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default Villages
