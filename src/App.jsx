import { useEffect, useRef, useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import NewsroomDashboard from './components/NewsroomDashboard'
import VillageExplorerSection from './components/VillageExplorerSection'
import TrustSection from './components/TrustSection'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import LoadingScreen from './components/LoadingScreen'
import React from 'react'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import { RequireAdmin, RequireAuth } from './layout/RouteGuards'
import AdminLayout from './layout/AdminLayout'
import News from './pages/News'
import Categories from './pages/Categories'
import Villages from './pages/Villages'
import Report from './pages/Report.jsx'
import Trending from './pages/Trending'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import PrivacyPolicy from './pages/Privacy'
import TermsConditions from './pages/TermsConditions'
import EditorialPolicy from './pages/EditorialPolicy'
import AdvertiseWithUs from './pages/AdvertiseWithUs'
import CategoryTopic from './pages/CategoryTopic'
import Profile from './pages/ProfilePage'
import OnboardingProfile from './pages/OnboardingProfile'

import AdminOverview from './pages/admin/AdminOverview'
import AdminNewsRequests from './pages/admin/AdminNewsRequests'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminBreakingAlerts from './pages/admin/AdminBreakingAlerts'
import AdminVillages from './pages/admin/AdminVillages'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReports from './pages/admin/AdminReports'
import AdminRevenue from './pages/admin/AdminRevenue'
import AdminSettings from './pages/admin/AdminSettings'

function HomeContent({ scrolled }) {
  return (
    <div className="min-h-screen bg-[#f7f8f4] pb-4">
      <Header scrolled={scrolled} />
      <main>
        <NewsroomDashboard />
        <VillageExplorerSection />
        <TrustSection />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const loadStartRef = useRef(Date.now())
  const hideTimerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Keep the loading screen on screen for at least one second.
    const onLoaded = () => {
      const elapsed = Date.now() - loadStartRef.current
      const remaining = Math.max(1000 - elapsed, 0)

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
      }

      hideTimerRef.current = window.setTimeout(() => setLoading(false), remaining)
    }

    if (document.readyState === 'complete') {
      onLoaded()
    } else {
      window.addEventListener('load', onLoaded, { once: true })
    }

    return () => window.removeEventListener('load', onLoaded)
  }, [])

  if (loading) return <LoadingScreen />

  // create a router with future flags to opt into v7 behaviors and silence console warnings
  const router = createBrowserRouter(
    [
      { path: '/', element: <HomeContent scrolled={scrolled} /> },
      { path: '/news', element: <News /> },
      { path: '/categories', element: <Categories /> },
      { path: '/category/:slug', element: <CategoryTopic /> },
      { path: '/villages', element: <Villages /> },
      { path: '/report', element: <RequireAuth><Report /></RequireAuth> },
      { path: '/profile', element: <RequireAuth><Profile /></RequireAuth> },
      { path: '/onboarding', element: <RequireAuth><OnboardingProfile /></RequireAuth> },
      { path: '/trending', element: <Trending /> },
      { path: '/about', element: <AboutUs /> },
      { path: '/contact', element: <ContactUs /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms-and-conditions', element: <TermsConditions /> },
      // backward-compatible redirect for older links
      { path: '/terms-conditions', element: <Navigate to="/terms-and-conditions" replace /> },
      { path: '/editorial-policy', element: <EditorialPolicy /> },
      { path: '/advertise', element: <AdvertiseWithUs /> },
      { path: '/login', element: <Login /> },
      { path: '/auth/login', element: <Navigate to="/login" replace /> },
      { path: '/signup', element: <Signup /> },
      { path: '/auth/signup', element: <Navigate to="/signup" replace /> },
      { path: '/auth/forgot', element: <ForgotPassword /> },
      {
        path: '/admin',
        element: (
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        ),
        children: [
          { index: true, element: <AdminOverview /> },
          { path: 'news-requests', element: <AdminNewsRequests /> },
          { path: 'breaking-alerts', element: <AdminBreakingAlerts /> },
          { path: 'villages', element: <AdminVillages /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'reports', element: <AdminReports /> },
          { path: 'analytics', element: <AdminAnalytics /> },
          { path: 'revenue', element: <AdminRevenue /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
    ],
    // router options left default
  )

  return (
    <LanguageProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
    </LanguageProvider>
  )
}

export default App
