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
    videos: 'वीडीयो',
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
    
    // Videos page
    videoGallery: 'वीडीयो गैलरी',
    watchLearn: 'देखें और सीखें',
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
    videos: 'Videos',
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
    
    // Videos page
    videoGallery: 'Video Gallery',
    watchLearn: 'Watch & Learn',
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
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
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
