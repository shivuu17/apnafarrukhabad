import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function AdvertiseWithUs() {
  useEffect(() => {
    document.title = 'Advertise — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Advertising opportunities on ApnaFarrukhabad — reach local readers')
  }, [])

  return (
    <CommonPageShell title="Advertise With Us" subtitle="Connect your brand with local readers in Farrukhabad">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> Advertise
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Why advertise with us?</h3>
            <p className="text-slate-700">Reach engaged local readers with targeted placements across our news, village, and category pages.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Placements & Reach</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Banner placements on category and village pages</li>
              <li>Sponsored stories and event promotions</li>
              <li>Custom campaigns for local businesses</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Accepted advertisers & policy</h3>
            <p className="text-slate-700">We accept responsible local businesses and community organizations. We do not accept misleading or harmful advertisements.</p>
          </section>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">Interested? Email <a href="mailto:ads@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">ads@apnafarrukhabad.com</a></p>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default AdvertiseWithUs
