export const adminSections = [
  { id: 'overview', label: 'Dashboard Overview' },
  { id: 'review', label: 'Content Review' },
  { id: 'villages', label: 'Village / Block' },
  { id: 'breaking', label: 'Breaking News' },
  { id: 'ads', label: 'Banner / Ads' },
  { id: 'users', label: 'Users' },
  { id: 'reports', label: 'Complaints' },
  { id: 'jobs', label: 'Jobs / Marketplace' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'ai', label: 'AI Features' },
  { id: 'settings', label: 'Settings' },
]

export const topStats = [
  { label: 'Total Posts', value: '12.4k', delta: '+18.2%', tone: 'emerald', trend: [30, 36, 32, 44, 48, 52, 61] },
  { label: 'Pending Approval', value: '48', delta: '+6 today', tone: 'amber', trend: [16, 18, 22, 26, 31, 38, 48] },
  { label: 'Approved Today', value: '183', delta: '+12.8%', tone: 'sky', trend: [60, 68, 72, 74, 88, 91, 95] },
  { label: 'Total Users', value: '8,940', delta: '+4.1%', tone: 'violet', trend: [70, 72, 73, 76, 78, 83, 88] },
  { label: 'Active Villages', value: '312', delta: '+7', tone: 'rose', trend: [18, 24, 26, 28, 29, 31, 34] },
  { label: 'Reports / Flagged', value: '29', delta: '-3', tone: 'orange', trend: [42, 40, 36, 35, 31, 30, 29] },
  { label: 'Trending Category', value: 'Agriculture', delta: '34% share', tone: 'lime', trend: [22, 28, 32, 36, 41, 46, 54] },
  { label: 'Site Visits (today)', value: '86.3k', delta: '+22.4%', tone: 'cyan', trend: [45, 52, 55, 61, 68, 74, 81] },
]

export const reviewPosts = [
  {
    id: 'post_001',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    title: 'Drainage work resumes after village meeting',
    description: 'Public works team started drain cleaning and repair in the east lane after repeated monsoon complaints.',
    uploader: 'Ravi Kumar',
    village: 'Usman Ganj',
    block: 'Farrukhabad',
    category: 'Infrastructure',
    timestamp: '12 mins ago',
    views: 1180,
    likes: 94,
    status: 'pending',
    priority: 'medium',
    pinned: false,
    breaking: false,
  },
  {
    id: 'post_002',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    title: 'Wheat procurement center opens early',
    description: 'Farmers reported faster queue movement after the procurement center opened two days earlier than planned.',
    uploader: 'Sonia Devi',
    village: 'Kayamganj',
    block: 'Kaimganj',
    category: 'Agriculture',
    timestamp: '1 hour ago',
    views: 3040,
    likes: 221,
    status: 'approved',
    priority: 'high',
    pinned: true,
    breaking: false,
  },
  {
    id: 'post_003',
    thumbnail: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
    title: 'School attendance improves after mid-day meal update',
    description: 'Teachers say attendance climbed after menu variety and hot meal timing was adjusted for local students.',
    uploader: 'Aman Yadav',
    village: 'Mohammadabad',
    block: 'Mohammadabad',
    category: 'Education',
    timestamp: '3 hours ago',
    views: 920,
    likes: 53,
    status: 'recheck',
    priority: 'low',
    pinned: false,
    breaking: false,
  },
]

export const villageBlocks = [
  {
    block: 'Rajepur',
    activeContributors: 126,
    mostViewedVillage: 'Rajepur Bazaar',
    inactiveAlerts: 4,
    posts: 412,
  },
  {
    block: 'Mohammadabad',
    activeContributors: 98,
    mostViewedVillage: 'Mohammadabad Khas',
    inactiveAlerts: 2,
    posts: 308,
  },
  {
    block: 'Kamalganj',
    activeContributors: 72,
    mostViewedVillage: 'Kamalganj Town',
    inactiveAlerts: 1,
    posts: 214,
  },
  {
    block: 'Kaimganj',
    activeContributors: 142,
    mostViewedVillage: 'Kaimganj Ward 7',
    inactiveAlerts: 6,
    posts: 521,
  },
  {
    block: 'Nawabganj',
    activeContributors: 54,
    mostViewedVillage: 'Nawabganj East',
    inactiveAlerts: 3,
    posts: 143,
  },
  {
    block: 'Shamsabad',
    activeContributors: 111,
    mostViewedVillage: 'Shamsabad Center',
    inactiveAlerts: 2,
    posts: 391,
  },
  {
    block: 'Barhpur',
    activeContributors: 61,
    mostViewedVillage: 'Barhpur Market',
    inactiveAlerts: 5,
    posts: 168,
  },
]

export const breakingStories = [
  { id: 'bn_1', headline: 'Flood warning: low-lying village roads may close tonight', priority: 'critical', expiresIn: '45 min', spotlight: true },
  { id: 'bn_2', headline: 'Power restoration work scheduled across two blocks', priority: 'high', expiresIn: '2 hr', spotlight: false },
  { id: 'bn_3', headline: 'Festival traffic plan approved for town center', priority: 'medium', expiresIn: '8 hr', spotlight: false },
]

export const bannerItems = [
  { id: 'ad_1', label: 'Homepage hero banner', ctr: '4.8%', impressions: '92k', revenue: '₹18,400' },
  { id: 'ad_2', label: 'Sponsored posts', ctr: '6.2%', impressions: '38k', revenue: '₹9,700' },
  { id: 'ad_3', label: 'Local business ads', ctr: '3.9%', impressions: '21k', revenue: '₹6,150' },
  { id: 'ad_4', label: 'Festival popup ads', ctr: '8.1%', impressions: '14k', revenue: '₹4,950' },
]

export const userRoles = ['Super Admin', 'Admin', 'Moderator', 'Reporter', 'Verified Local Contributor', 'Normal User']

export const userRows = [
  { name: 'Anjali Verma', role: 'Reporter', village: 'Usman Ganj', status: 'verified', fraud: 'low', spam: 'low' },
  { name: 'Rohit Singh', role: 'Moderator', village: 'Kaimganj', status: 'active', fraud: 'medium', spam: 'low' },
  { name: 'Sana Khan', role: 'Verified Local Contributor', village: 'Shamsabad', status: 'active', fraud: 'low', spam: 'low' },
  { name: 'Deepak Mishra', role: 'Normal User', village: 'Mohammadabad', status: 'suspended', fraud: 'high', spam: 'high' },
]

export const complaintQueue = [
  { id: 'cmp_1', type: 'Fake news', priority: 'critical', location: 'Rajepur', age: '12m' },
  { id: 'cmp_2', type: 'Abuse report', priority: 'medium', location: 'Kaimganj', age: '38m' },
  { id: 'cmp_3', type: 'Duplicate post', priority: 'low', location: 'Shamsabad', age: '2h' },
]

export const jobsListings = [
  { id: 'job_1', type: 'Local jobs', title: 'School assistant needed', status: 'pending' },
  { id: 'job_2', type: 'Business listing', title: 'Seed supplier update', status: 'approved' },
  { id: 'job_3', type: 'Property listing', title: 'Plot near main road', status: 'pending' },
  { id: 'job_4', type: 'Event', title: 'Krishi mela announcement', status: 'review' },
]

export const analyticsSeries = {
  village: [32, 44, 38, 52, 61, 58, 72],
  category: [22, 30, 41, 35, 48, 52, 60],
  growth: [8, 11, 14, 16, 19, 21, 25],
  engagement: [40, 36, 45, 49, 53, 56, 62],
  timing: [12, 20, 18, 30, 24, 38, 46],
  topics: [26, 24, 31, 29, 36, 39, 45],
}

export const notifications = [
  'District-wide weather alert queued for 7:00 PM',
  'Village-specific festival greeting scheduled for tomorrow',
  'Government scheme update prepared for Shamsabad',
]

export const aiCapabilities = [
  'Spam detection',
  'Duplicate detection',
  'Bad language flagging',
  'Fake image detection',
  'Auto category suggestion',
  'Headline generation',
  'Hindi / English translation',
]
