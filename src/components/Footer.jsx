import { useState } from 'react'
import { MapPin, Users, FileText, Bell, Globe, Camera, Play, MessageCircle, Mail, Shield, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AFLogo from '../assets/AF.png'
import { Modal } from './ui/Modals'
import { Input } from './ui/FormInputs'
import { Button } from './ui/Button'
import useAuth from '../hooks/useAuth'

function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminLoginLoading, setAdminLoginLoading] = useState(false)
  const [adminLoginError, setAdminLoginError] = useState('')
  const isAdmin = (account) => ['admin', 'superadmin', 'moderator'].includes(String(account?.role || '').trim().toLowerCase()) || Boolean(account?.isAdmin)

  const stats = [
    {
      icon: MapPin,
      number: '412',
      label: 'VILLAGES COVERED',
      color: 'text-teal-600'
    },
    {
      icon: Users,
      number: '1,850+',
      label: 'VERIFIED REPORTERS',
      color: 'text-teal-600'
    },
    {
      icon: FileText,
      number: '24.6k',
      label: 'STORIES PUBLISHED',
      color: 'text-teal-600'
    },
    {
      icon: Bell,
      number: '3,920',
      label: 'FARM ALERTS',
      color: 'text-teal-600'
    },
    {
      icon: Users,
      number: '3.8M',
      label: 'MONTHLY READERS',
      color: 'text-teal-600'
    }
  ]

  const handleSocialClick = (platform) => {
    const urls = {
      Facebook: 'https://www.facebook.com/',
      Twitter: 'https://twitter.com/',
      Instagram: 'https://www.instagram.com/',
      YouTube: 'https://www.youtube.com/',
      WhatsApp: 'https://wa.me/919123456789',
    }
    const url = urls[platform]
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const openPage = (path) => {
    // kept for backwards compatibility with other callers
    navigate(path)
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      window.scrollTo(0, 0)
    }
  }

  const openAdminLogin = (event) => {
    event.preventDefault()
    setAdminLoginError('')
    setShowAdminLogin(true)
  }

  const handleAdminLogin = async (event) => {
    event.preventDefault()
    setAdminLoginError('')
    setAdminLoginLoading(true)

    try {
      const result = await login({ email: adminEmail, password: adminPassword })
      if (!isAdmin(result?.user)) {
        throw new Error('This account does not have admin access')
      }

      setShowAdminLogin(false)
      setAdminEmail('')
      setAdminPassword('')
      navigate('/admin')
    } catch (error) {
      setAdminLoginError(error?.message || 'Unable to sign in as admin')
    } finally {
      setAdminLoginLoading(false)
    }
  }

  const closeAdminLogin = () => {
    setShowAdminLogin(false)
    setAdminLoginError('')
  }

  return (
    <footer className="bg-white">
      {/* Main Footer Section */}
      <div className="bg-[#13733d] text-white px-3 sm:px-4 lg:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Left: Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={AFLogo} alt="ApnaFarrukhabad" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-black text-white">ApnaFarrukhabad</h3>
                  <p className="text-xs text-emerald-50">Your voice. Your village. Your news.</p>
                </div>
              </div>
              <p className="text-sm text-emerald-50 leading-6 mt-4">
                ApnaFarrukhabad is a community-powered platform bringing you the latest local news, weather updates, and important alerts from every corner of Farrukhabad.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleSocialClick('Facebook')} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  <Globe size={18} />
                </button>
                <button onClick={() => handleSocialClick('Twitter')} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  <Camera size={18} />
                </button>
                <button onClick={() => handleSocialClick('Instagram')} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  <MessageCircle size={18} />
                </button>
                <button onClick={() => handleSocialClick('YouTube')} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  <Play size={18} />
                </button>
                <button onClick={() => handleSocialClick('WhatsApp')} className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  <Mail size={18} />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-100">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-emerald-50 hover:text-white transition">Home</Link></li>
                <li><Link to="/news" className="text-emerald-50 hover:text-white transition">News</Link></li>
                <li><Link to="/villages" className="text-emerald-50 hover:text-white transition">Villages</Link></li>
                <li><Link to="/categories" className="text-emerald-50 hover:text-white transition">Categories</Link></li>
                <li><Link to="/videos" className="text-emerald-50 hover:text-white transition">Videos</Link></li>
                <li><Link to="/report" className="text-emerald-50 hover:text-white transition">Report News</Link></li>
                <li><Link to="/trending" className="text-emerald-50 hover:text-white transition">Trending</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-100">Categories</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => openPage('/category/agriculture')} className="text-emerald-50 hover:text-white transition">Agriculture</button></li>
                <li><button onClick={() => openPage('/category/education')} className="text-emerald-50 hover:text-white transition">Education</button></li>
                <li><button onClick={() => openPage('/category/health')} className="text-emerald-50 hover:text-white transition">Health</button></li>
                <li><button onClick={() => openPage('/category/infrastructure')} className="text-emerald-50 hover:text-white transition">Infrastructure</button></li>
                <li><button onClick={() => openPage('/category/weather')} className="text-emerald-50 hover:text-white transition">Weather</button></li>
                <li><button onClick={() => openPage('/category/business')} className="text-emerald-50 hover:text-white transition">Business</button></li>
                <li><button onClick={() => openPage('/category/sports')} className="text-emerald-50 hover:text-white transition">Sports</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-100">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="text-emerald-50 hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="text-emerald-50 hover:text-white transition">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="text-emerald-50 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="text-emerald-50 hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link to="/editorial-policy" className="text-emerald-50 hover:text-white transition">Editorial Policy</Link></li>
                <li><Link to="/advertise" className="text-emerald-50 hover:text-white transition">Advertise With Us</Link></li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-100">Connect With Us</h4>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li className="flex gap-2">
                  <span>📍</span>
                  <span>Farrukhabad, Uttar Pradesh, India</span>
                </li>
                <li className="flex gap-2">
                  <span>📱</span>
                  <a href="tel:+919123456789" className="hover:text-white transition">+91 9123456789</a>
                </li>
                <li className="flex gap-2">
                  <span>✉️</span>
                  <a href="mailto:info@apnafarrukhabad.com" className="hover:text-white transition">info@apnafarrukhabad.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-emerald-900/40 pt-8" />

          {/* Copyright */}
          <div className="flex items-center justify-center gap-4 text-sm text-emerald-50 text-center">
            <p>© 2024 ApnaFarrukhabad. All rights reserved.</p>
            <span className="text-emerald-100">|</span>
            <button
              type="button"
              onClick={openAdminLogin}
              className={`inline-flex items-center gap-2 font-semibold transition ${location.pathname.startsWith('/admin') ? 'text-white' : 'text-emerald-100 hover:text-white'}`}
            >
              <Shield size={14} /> Admin
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showAdminLogin} onClose={closeAdminLogin} title="Admin sign in" size="sm">
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-900">
            Sign in with a Firebase admin account to open the admin panel.
          </div>

          <Input
            label="Admin Email"
            type="email"
            value={adminEmail}
            onChange={(event) => setAdminEmail(event.target.value)}
            placeholder="Admin email"
            required
          />

          <Input
            label="Admin Password"
            type="password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            placeholder="Admin password"
            required
          />

          {adminLoginError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {adminLoginError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeAdminLogin}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" variant="primary" loading={adminLoginLoading}>
              Sign in as Admin
            </Button>
          </div>
        </form>
      </Modal>
    </footer>
  )
}

export default Footer
