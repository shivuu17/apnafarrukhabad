import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function EditorialPolicy() {
  useEffect(() => {
    document.title = 'Editorial Policy — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Editorial standards and correction policy for ApnaFarrukhabad')
  }, [])

  return (
    <CommonPageShell title="Editorial Policy" subtitle="See how we choose, verify, and update stories">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> Editorial Policy
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Accuracy & Sourcing</h3>
            <p className="text-slate-700">We verify facts and attribute sources. When we report on local events, we prioritize first-hand accounts and official statements.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Fairness</h3>
            <p className="text-slate-700">Coverage is balanced and aims to represent community perspectives. We avoid sensationalism.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Corrections & Responsibility</h3>
            <p className="text-slate-700">If an error is found, we correct it promptly and transparently. Contact us to request a correction.</p>
          </section>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">To request a correction, email <a href="mailto:editor@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">editor@apnafarrukhabad.com</a></p>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default EditorialPolicy
