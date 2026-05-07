import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Privacy practices for ApnaFarrukhabad — what we collect and how it is used')
  }, [])

  return (
    <CommonPageShell title="Privacy Policy" subtitle="How we handle user data">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> Privacy Policy
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Data Collection</h3>
            <p className="text-slate-700">We collect basic information needed to provide local news and alerts — this includes location preferences, device identifiers, and optional account information you provide.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Cookies</h3>
            <p className="text-slate-700">We use cookies for session management and to remember preferences. You can control cookies via your browser settings.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">How Data Is Used</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>To personalize local content and alerts</li>
              <li>To improve the platform and prevent abuse</li>
              <li>To communicate service-related messages</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Security</h3>
            <p className="text-slate-700">We maintain reasonable security measures to protect your information. However, no system is 100% secure.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Third-party Links</h3>
            <p className="text-slate-700">Our site may contain links to external services. We are not responsible for policies of third parties.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#0F6B35] mb-2">Your Rights</h3>
            <p className="text-slate-700">You can request access, correction, or deletion of your personal information by contacting us.</p>
          </section>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">Questions? <a href="mailto:privacy@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">privacy@apnafarrukhabad.com</a></p>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default PrivacyPolicy
