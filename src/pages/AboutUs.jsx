import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function AboutUs() {
  useEffect(() => {
    document.title = 'About — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'About ApnaFarrukhabad — mission, vision and community values')
  }, [])

  return (
    <CommonPageShell title="About Us" subtitle="Learn how ApnaFarrukhabad serves the community">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> About
        </nav>

        <h2 className="text-2xl font-extrabold text-[#06391C] mb-2">Our Mission & Vision</h2>
        <div className="h-1 w-24 bg-[#0F6B35] mb-6 rounded-sm" />

        <p className="text-slate-700 leading-relaxed mb-6">
          ApnaFarrukhabad connects villages with reliable local news, alerts, and resources. We build tools and stories that help
          communities make informed decisions — from crop advisories to school updates and local markets.
        </p>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#0F6B35] mb-2">What We Cover</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Local news and human stories</li>
            <li>Agriculture and mandi rate updates</li>
            <li>Weather and farm alerts</li>
            <li>Community events and public notices</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Community First</h3>
          <p className="text-slate-700 leading-relaxed">
            We prioritize verified, community-sourced reporting and work with local contributors to ensure accuracy and relevance.
          </p>
        </section>

        <div className="mt-10 border-t pt-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Our Values</h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-bold">Trust</p>
              <p className="text-sm text-slate-600">Verified reporting and clear sourcing.</p>
            </div>
            <div>
              <p className="font-bold">Service</p>
              <p className="text-sm text-slate-600">Useful information, not noise.</p>
            </div>
            <div>
              <p className="font-bold">Access</p>
              <p className="text-sm text-slate-600">Free access to local news for everyone in the district.</p>
            </div>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default AboutUs
