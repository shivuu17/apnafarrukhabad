import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionHeader from './SectionHeader'
import { villages } from '../data/homeData'

function VillageExplorerSection() {
  const navigate = useNavigate()

  if (!villages.length) {
    return (
      <section className="px-3 pt-6 sm:px-4 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[22px] border border-slate-200 bg-white p-5 shadow-soft">
          <SectionHeader title="Village Explorer" subtitle="No live village profiles yet" />
          <p className="mt-3 text-sm text-slate-600">Add village data from your backend to populate this area.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 pt-6 sm:px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Village Explorer" subtitle="Nearby village snapshots" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {villages.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => navigate(`/villages?village=${encodeURIComponent(item.slug)}`)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="relative overflow-hidden rounded-[22px] border border-slate-200 shadow-soft cursor-pointer active:shadow-md"
            >
              <img src={item.image} alt={item.name} loading="lazy" className="h-40 w-full object-cover sm:h-44 md:h-48" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 rounded-xl border border-white/30 bg-black/40 p-3 sm:p-4 backdrop-blur-md">
                <p className="text-base sm:text-lg font-extrabold text-white">{item.name}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">{item.vibe}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white">{item.stories} stories</span>
                  <span className="rounded-full bg-saffron-500 px-2.5 py-1 text-xs sm:text-[10px] font-extrabold text-white">
                    {item.alert}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VillageExplorerSection
