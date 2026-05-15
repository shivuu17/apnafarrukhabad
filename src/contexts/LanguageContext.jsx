import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  hi: {
    // Header
    about: 'हमारे बारे में',
    advertise: 'विज्ञापन दें',
    contact: 'संपर्क करें',
    login: 'लॉगिन',
    signup: 'साइन अप',
    language: 'भाषा',
    
    // Navigation
    home: 'होम',
    news: 'न्यूज़',
    categories: 'श्रेणियाँ',
    villages: 'गांव',
    report: 'रिपोर्ट करें',
    trending: 'ट्रेंडिंग',
    
    // Home page
    liveNews: 'लाइव समाचार',
    weatherToday: 'आज का मौसम',
    liveMarquee: 'फर्रुखाबाद की हर छोटी-बड़ी खबर, सबसे पहले — लाइव डिस्ट्रिक्ट फीड अपडेट्स',
    
    // News page
    allNews: 'सभी समाचार',
    everyNews: 'आपके जिले की हर खबर',
    readMore: 'पूरी खबर पढ़ें',
    
    // Categories page
    allCategories: 'श्रेणियाँ',
    findNews: 'अपनी पसंद की खबरें खोजें',
    agriculture: 'कृषि',
    health: 'स्वास्थ्य',
    education: 'शिक्षा',
    business: 'व्यापार',
    sports: 'खेल',
    government: 'सरकारी योजनाएं',
    mandiRates: 'मंडी भाव',
    weather: 'मौसम',
    stories: 'खबरें',
    
    // Villages page
    findVillages: 'गांव खोजें',
    allVillages: 'फर्रुखाबाद के सभी गांव',
    population: 'जनसंख्या',
    active: 'सक्रिय',
    peaceful: 'शांत',
    
    views: 'views',
    
    // Report page
    submitReport: 'अपनी रिपोर्ट सबमिट करें',
    shareNews: 'महत्वपूर्ण खबरें साझा करें',
    reportTitle: 'रिपोर्ट का शीर्षक',
    enterTitle: 'संक्षिप्त शीर्षक लिखें',
    villageSelection: 'गांव का नाम',
    selectVillage: '-- गांव चुनें --',
    category: 'श्रेणी',
    selectCategory: '-- श्रेणी चुनें --',
    description: 'विस्तृत विवरण',
    enterDescription: 'अपनी रिपोर्ट के बारे में विस्तार से बताएं',
    name: 'नाम',
    enterName: 'आपका नाम',
    phone: 'फोन नंबर',
    enterPhone: '10 अंकों का नंबर',
    submit: 'रिपोर्ट सबमिट करें',
    submitted: '✅ आपकी रिपोर्ट सफलतापूर्वक सबमिट हुई!',
    
    // Trending page
    trendingNews: 'ट्रेंडिंग खबरें',
    nowTrending: 'अभी चर्चाओं में',
    save: 'Save',
    
    // Footer
    newsletter: 'न्यूजलेटर',
    subscribe: 'सब्सक्राइब करें',
    enterEmail: 'अपना ईमेल दर्ज करें',
    
    // Mobile Nav
    explore: 'खोजें',
    upload: 'अपलोड',
    market: 'बाजार',
    profile: 'प्रोफाइल',
    // Footer / misc
    tagline: 'आपकी आवाज़। आपके गांव। आपकी खबर।',
    platformDescription: 'ApnaFarrukhabad एक समुदाय चालित प्लेटफ़ॉर्म है जो आपको सबसे ताज़ा स्थानीय समाचार, मौसम अपडेट और महत्वपूर्ण अलर्ट देता है।',
    quickLinks: 'त्वरित लिंक',
    categoriesHeading: 'श्रेणियाँ',
    company: 'कंपनी',
    connectWithUs: 'हमसे जुड़ें',
    villagesCovered: 'कवर किए गए गांव',
    verifiedReporters: 'सत्यापित रिपोर्टर',
    storiesPublished: 'कहानी प्रकाशित',
    farmAlerts: 'कृषि अलर्ट',
    monthlyReaders: 'मासिक पाठक',
    admin: 'एडमिन',
    privacyPolicy: 'गोपनीयता नीति',
    termsAndConditions: 'नियम और शर्तें',
    editorialPolicy: 'संपादकीय नीति',
    comingSoonTitle: 'बिज़नेस प्रोफ़ाइल जल्द आ रही है',
    comingSoonBody: 'यह सेक्शन बिज़नस प्रोफ़ाइल के लिए होगा जहाँ लोग अपनी दुकानें, व्यापार नाम या स्थान विवरण सूचीबद्ध कर सकेंगे।',
  },
  en: {
    // Header
    about: 'About Us',
    advertise: 'Advertise',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    language: 'Language',
    
    // Navigation
    home: 'Home',
    news: 'News',
    categories: 'Categories',
    villages: 'Villages',
    report: 'Report',
    trending: 'Trending',
    
    // Home page
    liveNews: 'Live News',
    liveMarquee: 'Every news from Farrukhabad, first — Live district feed updates',
    weatherToday: "Today's Weather",
    
    // News page
    allNews: 'All News',
    everyNews: 'Every news from your district',
    readMore: 'Read Full Story',
    
    // Categories page
    allCategories: 'Categories',
    findNews: 'Find your favorite news',
    agriculture: 'Agriculture',
    health: 'Health',
    education: 'Education',
    business: 'Business',
    sports: 'Sports',
    government: 'Government Schemes',
    mandiRates: 'Mandi Rates',
    weather: 'Weather',
    stories: 'Stories',
    
    // Villages page
    findVillages: 'Find Villages',
    allVillages: 'All Villages of Farrukhabad',
    population: 'Population',
    active: 'Active',
    peaceful: 'Peaceful',
    
    views: 'views',
    
    // Report page
    submitReport: 'Submit Your Report',
    shareNews: 'Share Important News',
    reportTitle: 'Report Title',
    enterTitle: 'Enter a brief title',
    villageSelection: 'Village Name',
    selectVillage: '-- Select Village --',
    category: 'Category',
    selectCategory: '-- Select Category --',
    description: 'Description',
    enterDescription: 'Describe your report in detail',
    name: 'Name',
    enterName: 'Your Name',
    phone: 'Phone',
    enterPhone: 'Enter 10 digit number',
    submit: 'Submit Report',
    submitted: '✅ Your report submitted successfully!',
    
    // Trending page
    trendingNews: 'Trending News',
    nowTrending: 'Now in discussion',
    save: 'Save',
    
    // Footer
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    enterEmail: 'Enter your email',
    
    // Mobile Nav
    explore: 'Explore',
    upload: 'Upload',
    market: 'Market',
    profile: 'Profile',
      // Footer / misc
      tagline: 'Your voice. Your village. Your news.',
      platformDescription: 'ApnaFarrukhabad is a community-powered platform bringing you local news, weather updates, and important alerts from across Farrukhabad.',
      quickLinks: 'Quick Links',
      categoriesHeading: 'Categories',
      company: 'Company',
      connectWithUs: 'Connect With Us',
      villagesCovered: 'Villages covered',
      verifiedReporters: 'Verified reporters',
      storiesPublished: 'Stories published',
      farmAlerts: 'Farm alerts',
      monthlyReaders: 'Monthly readers',
      admin: 'Admin',
      privacyPolicy: 'Privacy Policy',
      termsAndConditions: 'Terms & Conditions',
      editorialPolicy: 'Editorial Policy',
      comingSoonTitle: 'Business Profile Coming Soon',
      comingSoonBody: 'This section is for business profiles where people can list their shops, business name, or location details.',
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = window.localStorage.getItem('appLanguage')
      return saved || 'en'
    } catch (e) {
      return 'en'
    }
  })

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en'
      try {
        window.localStorage.setItem('appLanguage', next)
      } catch (e) {
        // ignore
      }
      return next
    })
  }

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
