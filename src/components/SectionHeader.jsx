import { motion } from 'framer-motion'

function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3"
    >
      <h2 className="text-lg font-extrabold tracking-tight text-navy-900 sm:text-xl">{title}</h2>
      {subtitle ? <p className="text-xs font-semibold text-slate-500 sm:text-right">{subtitle}</p> : null}
    </motion.div>
  )
}

export default SectionHeader
