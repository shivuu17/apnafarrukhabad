import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import SectionHeader from './SectionHeader'

function CommonPageShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f4] pb-4">
      <Header scrolled={false} />
      <main className="px-3 pt-4 sm:px-4 sm:pt-6 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
          <SectionHeader title={title} subtitle={subtitle} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default CommonPageShell
