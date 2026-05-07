export const heroCards = [
  {
    label: 'Rain Alert',
    detail: 'Monsoon burst likely in 2 hours',
    tone: 'bg-sky-100 text-sky-700 border-sky-200'
  },
  {
    label: 'Crop Disease',
    detail: 'Leaf blight watch in Kayamganj',
    tone: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    label: 'Breaking News',
    detail: 'Power outage in 3 villages',
    tone: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  {
    label: 'Mandi Rate Update',
    detail: 'Potato +4% in Farrukhabad mandi',
    tone: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    label: 'Village Report',
    detail: 'Road repair issue filed from Amritpur',
    tone: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  }
]

export const quickAccess = [
  { title: 'Local News', icon: 'Newspaper' },
  { title: 'Farming', icon: 'Wheat' },
  { title: 'Weather', icon: 'CloudSun' },
  { title: 'Mandi Rates', icon: 'LineChart' },
  { title: 'Emergency Alerts', icon: 'Siren' },
  { title: 'Govt Schemes', icon: 'Landmark' },
  { title: 'Buy / Sell', icon: 'Store' },
  { title: 'Village Videos', icon: 'Clapperboard' }
]

export const feedData = [
  {
    title: 'Canal water released early for paddy growers across Rajepur belt',
    summary:
      'Farmers reported improved irrigation timing after district-level review with canal officers.',
    village: 'Rajepur',
    category: 'Farming',
    reporter: 'Ankit Chauhan',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    comments: 42,
    time: '12 min ago',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1100&q=80'
  },
  {
    title: 'Village transformer fault restored after 9-hour outage in Usmanganj',
    summary:
      'Residents and local linemen coordinated overnight, restoring power before school hours.',
    village: 'Usmanganj',
    category: 'Civic',
    reporter: 'Shabnam Khan',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    comments: 29,
    time: '28 min ago',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1100&q=80'
  },
  {
    title: 'Mandi traders flag sudden mustard demand rise from nearby districts',
    summary:
      'Procurement agents expect rates to stay strong this week, especially for dry stock.',
    village: 'Farrukhabad Mandi',
    category: 'Mandi',
    reporter: 'Imran Siddiqui',
    avatar:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
    comments: 65,
    time: '49 min ago',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=80'
  },
  {
    title: 'Students map pothole zones and submit route safety report to block office',
    summary:
      'Citizen volunteers used mobile location pins to report 16 unsafe stretches on village roads.',
    village: 'Mohammadabad',
    category: 'Community',
    reporter: 'Priya Verma',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    comments: 18,
    time: '1 hr ago',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1100&q=80'
  },
  {
    title: 'Rainwater logging reported near primary health center access lane',
    summary:
      'Village residents requested quick drainage cleanup before predicted heavy showers tonight.',
    village: 'Amritpur',
    category: 'Alert',
    reporter: 'Gaurav Yadav',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&q=80',
    comments: 23,
    time: '1 hr ago',
    image:
      'https://images.unsplash.com/photo-1475776408506-9a5371e7a068?auto=format&fit=crop&w=1100&q=80'
  },
  {
    title: 'Farm women collective launches direct vegetable selling corner',
    summary:
      'The new corner supports fair daily rates and digital payment for nearby households.',
    village: 'Kayamganj',
    category: 'Marketplace',
    reporter: 'Neha Tiwari',
    avatar:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80',
    comments: 34,
    time: '2 hr ago',
    image:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1100&q=80'
  }
]

export const farmingIntel = [
  { title: 'Crop Disease Alert', value: 'Blight Watch', note: 'Potato fields in low-moisture zone' },
  { title: 'Irrigation Advice', value: 'Light Cycle', note: '30 min evening flow recommended' },
  { title: 'Sowing Calendar', value: 'Millet Window', note: 'Best sowing in next 5 days' },
  { title: 'Fertilizer Update', value: 'DAP Stable', note: 'No major price change this week' },
  { title: 'Govt Scheme Alert', value: 'PM-Kisan', note: 'Verification camp on Sunday' },
  { title: 'Pest Warning', value: 'Medium Risk', note: 'Aphid activity seen near canal belt' }
]

export const mandiRates = [
  { item: 'Potato', rate: 'Rs 1,180 / qtl', trend: '+4.2%', market: 'Farrukhabad Mandi', up: true },
  { item: 'Wheat', rate: 'Rs 2,460 / qtl', trend: '+1.1%', market: 'Kayamganj Yard', up: true },
  { item: 'Mustard', rate: 'Rs 5,590 / qtl', trend: '-0.7%', market: 'Chilsara Center', up: false },
  { item: 'Rice', rate: 'Rs 3,120 / qtl', trend: '+2.0%', market: 'Rajepur Market', up: true },
  { item: 'Vegetables', rate: 'Rs 940 / crate', trend: '+3.8%', market: 'Sadar Bazaar', up: true }
]

export const weatherCards = [
  { label: 'Temperature', value: '33°C', note: 'Feels like 36°C' },
  { label: 'Humidity', value: '61%', note: 'Moisture level moderate' },
  { label: 'Rainfall Chance', value: '67%', note: 'Heavy spell expected tonight' },
  { label: 'Storm Alert', value: 'Yellow', note: 'Wind gusts after 7 PM' },
  { label: 'River Level', value: 'Normal+', note: 'Ganga +2.3m above baseline' },
  { label: 'Heatwave', value: 'Low', note: 'No severe warning today' }
]

export const villages = [
  {
    name: 'Kayamganj',
    vibe: 'Trading and education hub',
    stories: 126,
    alert: '2 alerts',
    image:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1100&q=80'
  },
  {
    name: 'Amritpur',
    vibe: 'River belt farming villages',
    stories: 88,
    alert: 'Flood watch',
    image:
      'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=1100&q=80'
  },
  {
    name: 'Mohammadabad',
    vibe: 'Dense local markets',
    stories: 104,
    alert: 'Power update',
    image:
      'https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=1100&q=80'
  },
  {
    name: 'Usmanganj',
    vibe: 'Smallholder crop community',
    stories: 76,
    alert: 'Road issue',
    image:
      'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?auto=format&fit=crop&w=1100&q=80'
  }
]

export const reels = [
  {
    caption: 'Field report: canal overflow managed by youth volunteers',
    likes: '1.9k likes',
    src: 'https://cdn.coverr.co/videos/coverr-farmer-working-in-a-field-2403/1080p.mp4',
    poster:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=450&q=80'
  },
  {
    caption: 'Tractor market: price negotiation highlights from morning',
    likes: '1.3k likes',
    src: 'https://cdn.coverr.co/videos/coverr-driving-through-india-1579/1080p.mp4',
    poster:
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=450&q=80'
  },
  {
    caption: 'Crop condition update after first pre-monsoon rain',
    likes: '2.1k likes',
    src: 'https://cdn.coverr.co/videos/coverr-cars-in-the-city-1567/1080p.mp4',
    poster:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=450&q=80'
  }
]

export const marketplace = [
  { title: 'Mahindra Tractor 575', tag: 'Tractor', price: 'Rs 5.2L', place: 'Kayamganj' },
  { title: 'Hybrid Paddy Seeds', tag: 'Seed', price: 'Rs 980/bag', place: 'Amritpur' },
  { title: 'Urea + DAP Combo', tag: 'Fertilizer', price: 'Rs 1,420', place: 'Mohammadabad' },
  { title: 'Fresh Wheat Bulk', tag: 'Crop Selling', price: 'Rs 2,520/qtl', place: 'Rajepur' },
  { title: 'Murrah Cattle Pair', tag: 'Cattle', price: 'Rs 1.1L', place: 'Usmanganj' },
  { title: 'Used Seed Drill', tag: 'Equipment', price: 'Rs 38,000', place: 'Sadar' }
]

export const trustStats = [
  { label: 'Villages Covered', value: '412' },
  { label: 'Verified Reporters', value: '1,850+' },
  { label: 'Stories Published', value: '24.6k' },
  { label: 'Farm Alerts', value: '3,920' },
  { label: 'Monthly Readers', value: '3.8M' }
]

export const alerts = [
  {
    id: 'a1',
    title: 'भारी बारिश चेतावनी',
    summary: 'अगले 24 घंटों में तेज़ बारिश की आशंका, निचले इलाकों के रहने वाले सतर्क रहें।',
    tone: 'bg-rose-50 text-rose-700',
  },
  {
    id: 'a2',
    title: 'पानी की आपूर्ति बाधित',
    summary: 'जल विभाग ने संकेत दिया कि कल सुबह कुछ पाइपलाइन सेवाओं में कटौती होगी।',
    tone: 'bg-amber-50 text-amber-700',
  },
]

export const trendingTags = [
  '#उसमानगंज_बारिश',
  '#किसान_समाचार',
  '#पानी_लॉगिंग',
  '#कृषि_अपडेट',
  '#मंडी_रेट',
]

export const footerActions = [
  { title: 'रिपोर्ट करें', subtitle: 'स्थानीय खबर साझा करें', icon: 'PenLine' },
  { title: 'वीडियो भेजें', subtitle: 'घटनाओं का डॉक्यूमेंट करें', icon: 'Camera' },
  { title: 'स्थानीय खोजें', subtitle: 'अपने गांव की जानकारी देखें', icon: 'MapPin' },
  { title: 'सत्यापन', subtitle: 'विश्वसनीय रिपोर्टर बनें', icon: 'BadgeCheck' },
  { title: 'मंडी देखें', subtitle: 'ताज़ा भाव और रुझान', icon: 'LineChart' },
]
