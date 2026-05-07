import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function TermsConditions() {
  useEffect(() => {
    document.title = 'Terms & Conditions — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Terms and conditions for using ApnaFarrukhabad')
  }, [])

  return (
    <CommonPageShell title="Terms & Conditions" subtitle="Review the rules that keep our community safe">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> Terms & Conditions
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Eligibility</h3>
            <p className="text-slate-700">Users must be at least 13 years old. Accounts are personal and non-transferable.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Posting Rules & Moderation</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Do not post illegal, hateful, or harmful content.</li>
              <li>Posts may be reviewed and removed if they violate community standards.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Prohibited Activities</h3>
            <p className="text-slate-700">No impersonation, spamming, or harvesting user data for unauthorized purposes.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Liability & Changes</h3>
            <p className="text-slate-700">We are not liable for user-generated content. We may modify these terms — updates will be posted on this page.</p>
          </section>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">Questions about terms? <a href="mailto:legal@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">legal@apnafarrukhabad.com</a></p>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default TermsConditions
