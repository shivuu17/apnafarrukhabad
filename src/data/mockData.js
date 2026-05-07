// Mock Data for ApnaFarrukhabad
// All sample data for components and pages

export const mockNews = [
  {
    id: '1',
    title: 'New irrigation canal approved for 12 villages in Amritpur block',
    summary: 'Farmers reported improved irrigation timing after district-level review with canal officers.',
    village: 'Amritpur',
    category: 'Farming',
    reporter: 'Ankit Chauhan',
    reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    verified: true,
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80',
    comments: 42,
    shares: 18,
    bookmarks: 26,
    timestamp: '12 min ago',
    breaking: false,
    trending: true
  },
  {
    id: '2',
    title: 'Village transformer fault restored after 9-hour outage',
    summary: 'Residents and local linemen coordinated overnight, restoring power before school hours.',
    village: 'Usmanganj',
    category: 'Civic',
    reporter: 'Shabnam Khan',
    reporterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    verified: true,
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&q=80',
    comments: 29,
    shares: 12,
    bookmarks: 15,
    timestamp: '28 min ago',
    breaking: true,
    trending: false
  },
  {
    id: '3',
    title: 'Mandi traders flag sudden mustard demand rise',
    summary: 'Procurement agents expect rates to stay strong this week, especially for dry stock.',
    village: 'Farrukhabad Mandi',
    category: 'Mandi',
    reporter: 'Imran Siddiqui',
    reporterAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=120&q=80',
    verified: true,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    comments: 65,
    shares: 34,
    bookmarks: 41,
    timestamp: '49 min ago',
    breaking: false,
    trending: true
  }
]

export const mockVillages = [
  {
    id: 'v1',
    name: 'Kayamganj',
    vibe: 'Trading and education hub',
    stories: 126,
    population: '~45,000',
    alerts: 2,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    featured: true
  },
  {
    id: 'v2',
    name: 'Amritpur',
    vibe: 'River belt farming villages',
    stories: 88,
    population: '~12,000',
    alerts: 1,
    image: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=800&q=80',
    featured: false
  },
  {
    id: 'v3',
    name: 'Mohammadabad',
    vibe: 'Dense local markets',
    stories: 104,
    population: '~28,000',
    alerts: 0,
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=800&q=80',
    featured: true
  },
  {
    id: 'v4',
    name: 'Usmanganj',
    vibe: 'Smallholder crop community',
    stories: 76,
    population: '~8,500',
    alerts: 1,
    image: 'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?w=800&q=80',
    featured: false
  }
]

export const mockMarketplaceItems = [
  {
    id: 'mp1',
    title: 'Mahindra Tractor 575',
    category: 'Tractor',
    price: 'Rs 5,20,000',
    seller: 'Rajesh Auto Dealer',
    location: 'Kayamganj',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    condition: 'Used',
    year: '2019',
    hours: '1200 hrs',
    contact: 'WhatsApp',
    phone: '+91-9876543210'
  },
  {
    id: 'mp2',
    title: 'Hybrid Paddy Seeds - High Yield',
    category: 'Seed',
    price: 'Rs 980 / bag',
    seller: 'Agro Supplies Pvt Ltd',
    location: 'Amritpur',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    condition: 'New',
    weight: '25 kg bag',
    quantity: '50 bags available',
    contact: 'WhatsApp'
  },
  {
    id: 'mp3',
    title: 'Fresh Wheat - Direct from Farm',
    category: 'Crop Selling',
    price: 'Rs 2,520 / quintal',
    seller: 'Farmer Cooperative',
    location: 'Rajepur',
    image: 'https://images.unsplash.com/photo-1622037122997-e2c90907bee3?w=800&q=80',
    condition: 'Fresh',
    quantity: '500 quintals',
    quality: 'Premium Grade',
    contact: 'Call'
  }
]

export const mandiRates = [
  {
    commodity: 'Potato',
    rate: '₹1,180 / qtl',
    trend: '+4.2%',
    up: true,
    market: 'Farrukhabad',
    lastUpdate: 'Today 10:30 AM'
  },
  {
    commodity: 'Wheat',
    rate: '₹2,460 / qtl',
    trend: '+1.1%',
    up: true,
    market: 'Kayamganj Yard',
    lastUpdate: 'Today 11:00 AM'
  },
  {
    commodity: 'Mustard',
    rate: '₹5,590 / qtl',
    trend: '-0.7%',
    up: false,
    market: 'Chilsara Center',
    lastUpdate: 'Today 9:45 AM'
  },
  {
    commodity: 'Rice',
    rate: '₹3,120 / qtl',
    trend: '+2.0%',
    up: true,
    market: 'Rajepur Market',
    lastUpdate: 'Today 10:15 AM'
  }
]

export const weatherData = {
  current: {
    temp: 33,
    feelsLike: 36,
    condition: 'Partly Cloudy',
    humidity: 61,
    windSpeed: 12,
    rainChance: 67,
    uvIndex: 8
  },
  alerts: [
    { type: 'rain', text: 'Heavy showers expected by evening', severity: 'warning' },
    { type: 'wind', text: 'Wind gusts up to 40 km/h after 7 PM', severity: 'info' }
  ],
  hourly: [
    { time: 'Now', temp: 33, icon: 'cloud' },
    { time: '2 PM', temp: 34, icon: 'cloud' },
    { time: '4 PM', temp: 32, icon: 'rain' },
    { time: '6 PM', temp: 28, icon: 'rain' },
    { time: '8 PM', temp: 24, icon: 'cloud' }
  ],
  weekly: [
    { day: 'Fri', high: 35, low: 22, condition: 'Rainy' },
    { day: 'Sat', high: 32, low: 20, condition: 'Cloudy' },
    { day: 'Sun', high: 36, low: 24, condition: 'Sunny' },
    { day: 'Mon', high: 38, low: 25, condition: 'Sunny' },
    { day: 'Tue', high: 34, low: 23, condition: 'Rainy' }
  ]
}

export const farmingAdvice = [
  {
    title: 'Crop Disease Alert',
    description: 'Leaf blight watch in potato fields',
    severity: 'warning',
    action: 'Monitor closely, consider copper spray'
  },
  {
    title: 'Irrigation Advisory',
    description: 'Light 30-min evening flow recommended',
    severity: 'info',
    action: 'Schedule for 6-7 PM today'
  },
  {
    title: 'Sowing Window',
    description: 'Best sowing time in next 5 days',
    severity: 'success',
    action: 'Prepare beds now'
  }
]

export const businessCategories = [
  { id: 1, name: 'Doctor', icon: 'stethoscope', color: 'bg-blue-100' },
  { id: 2, name: 'School', icon: 'graduation-cap', color: 'bg-purple-100' },
  { id: 3, name: 'Shop', icon: 'shopping-bag', color: 'bg-orange-100' },
  { id: 4, name: 'Tractor Dealer', icon: 'truck', color: 'bg-yellow-100' },
  { id: 5, name: 'Coaching', icon: 'book', color: 'bg-green-100' },
  { id: 6, name: 'Petrol Pump', icon: 'fuel-pump', color: 'bg-red-100' }
]

export const localBusinesses = [
  {
    id: 'b1',
    name: 'Sanjeevani Clinic',
    category: 'Doctor',
    location: 'Lohia Nagar',
    distance: '2.5 km',
    phone: '9876543210',
    verified: true,
    rating: 4.8,
    hours: 'Open now'
  },
  {
    id: 'b2',
    name: 'Bright Future Public School',
    category: 'School',
    location: 'Kayamganj Road',
    distance: '1.2 km',
    phone: '9123456789',
    verified: true,
    rating: 4.6,
    hours: '9 AM - 3 PM'
  }
]

export const events = [
  {
    id: 'e1',
    title: 'Farmers Conference',
    date: 'May 15, 2026',
    time: '10:00 AM',
    location: 'Kayamganj Panchayat',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    attending: 245,
    category: 'Farming'
  },
  {
    id: 'e2',
    title: 'Village Cleanup Drive',
    date: 'May 10, 2026',
    time: '7:00 AM',
    location: 'Amritpur Main Street',
    image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&q=80',
    attending: 128,
    category: 'Community'
  }
]

export const governmentSchemes = [
  {
    id: 's1',
    name: 'PM-Kisan',
    description: 'Income support for farmers',
    amount: '₹6,000/year',
    eligibility: 'All farmers',
    deadline: 'Ongoing',
    status: 'Active'
  },
  {
    id: 's2',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme',
    amount: 'Up to ₹2 lakh',
    eligibility: 'Farmers with registered land',
    deadline: 'May 31, 2026',
    status: 'Active'
  }
]

export const communityStats = {
  totalVillages: 412,
  registeredReporters: 1850,
  storiesPublished: 24600,
  farmAlerts: 3920,
  monthlyReaders: 3800000
}

export const sampleComments = [
  {
    id: 'c1',
    author: 'Farmer Dinesh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    verified: true,
    text: 'This is very helpful! We also faced the same issue last year.',
    timestamp: '2 hours ago',
    likes: 12,
    replies: 3
  },
  {
    id: 'c2',
    author: 'Local Reporter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    verified: true,
    text: 'Thanks for reporting this. Will follow up with officials.',
    timestamp: '1 hour ago',
    likes: 28,
    replies: 5
  }
]

export const notifications = [
  {
    id: 'n1',
    type: 'breaking',
    title: 'Breaking News',
    message: 'Heavy rainfall alert in your area',
    timestamp: '5 min ago',
    read: false
  },
  {
    id: 'n2',
    type: 'farming',
    title: 'Crop Advisory',
    message: 'Leaf blight watch activated for potato farms',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: 'n3',
    type: 'market',
    title: 'Mandi Update',
    message: 'Potato prices up 4.2% today',
    timestamp: '3 hours ago',
    read: true
  }
]

export const userProfile = {
  id: 'user123',
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '+91-9876543210',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  village: 'Kayamganj',
  role: 'citizen',
  bio: 'Farmer and community reporter from Kayamganj',
  storiesSubmitted: 24,
  followers: 342,
  following: 128,
  interests: ['Farming', 'Local News', 'Weather Alerts'],
  verified: true,
  joinedDate: 'Jan 2025'
}

export default {
  mockNews,
  mockVillages,
  mockMarketplaceItems,
  mandiRates,
  weatherData,
  farmingAdvice,
  businessCategories,
  localBusinesses,
  events,
  governmentSchemes,
  communityStats,
  sampleComments,
  notifications,
  userProfile
}
