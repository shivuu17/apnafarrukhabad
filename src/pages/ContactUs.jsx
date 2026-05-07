import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function ContactUs() {
  useEffect(() => {
    document.title = 'Contact — ApnaFarrukhabad'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Contact ApnaFarrukhabad for tips, support, or advertising')
  }, [])

  return (
    <CommonPageShell title="Contact Us" subtitle="Reach our team for news tips, partnerships, or support">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 py-8">
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> Contact
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <h3 className="text-lg font-bold text-[#0F6B35] mb-4">Get in touch</h3>
          <p className="text-slate-700 mb-6">For general inquiries, news tips, advertising, or reporting content, reach out using the contacts below.</p>

          <ul className="space-y-4 text-slate-700">
            <li><strong>General:</strong> <a href="mailto:info@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">info@apnafarrukhabad.com</a></li>
            <li><strong>News tips / Reporting:</strong> <a href="mailto:tips@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">tips@apnafarrukhabad.com</a></li>
            <li><strong>Advertising:</strong> <a href="mailto:ads@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">ads@apnafarrukhabad.com</a></li>
            <li><strong>Report content:</strong> <a href="mailto:report@apnafarrukhabad.com" className="text-[#0F6B35] hover:underline">report@apnafarrukhabad.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+919123456789" className="text-[#0F6B35] hover:underline">+91 9123456789</a></li>
            <li><strong>Location:</strong> Farrukhabad, Uttar Pradesh, India</li>
            <li><strong>Response time:</strong> We typically reply within 2 business days.</li>
          </ul>

          <div className="mt-8">
            <a href="mailto:info@apnafarrukhabad.com" className="inline-block bg-[#0F6B35] text-white px-5 py-3 rounded-lg">Need Help? Contact Us</a>
          </div>
        </div>
      </div>
    </CommonPageShell>
  )
}

export default ContactUs
