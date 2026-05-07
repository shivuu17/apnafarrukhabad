import React from 'react'
import { motion } from 'framer-motion'
import AFLogo from '../assets/AF.png'

const LoadingScreen = ({ message = 'Loading ApnaFarrukhabad...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-28 h-28 rounded-lg overflow-hidden">
          <img src={AFLogo} alt="Apna Farrukhabad" className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm text-neutral-700">{message}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
