import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { reels } from '../data/homeData'

function ReelsSection() {
  const videoRefs = useRef([])
  const [playing, setPlaying] = useState({})

  if (!reels.length) {
    return (
      <section className="px-3 pt-6 sm:px-4 md:px-6">
        <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl rounded-[22px] border border-slate-200 bg-white p-5 shadow-soft">
          <SectionHeader title="Video Reels" subtitle="No live reels yet" />
          <p className="mt-3 text-sm text-slate-600">Connect your video feed to show recent short clips here.</p>
        </div>
      </section>
    )
  }

  const handlePlay = (index) => {
    const video = videoRefs.current[index]
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying({ ...playing, [index]: true })
    } else {
      video.pause()
      setPlaying({ ...playing, [index]: false })
    }
  }

  return (
    <section className="px-3 pt-6 sm:px-4 md:px-6">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl">
        <SectionHeader title="Video Reels" subtitle="Tap and play" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 pr-1">
          {reels.map((item, index) => (
            <motion.article
              key={item.caption}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="relative h-[330px] min-w-[190px] overflow-hidden rounded-[24px] border border-slate-200 bg-black shadow-soft"
              className="relative h-[320px] min-w-[170px] sm:h-[330px] sm:min-w-[190px] md:h-[360px] md:min-w-[210px] overflow-hidden rounded-[24px] border border-slate-200 bg-black shadow-soft cursor-pointer active:shadow-md"
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el
                }}
                src={item.src}
                poster={item.poster}
                preload="none"
                muted
                loop
                playsInline
                className="h-full w-full cursor-pointer object-cover"
                onClick={() => handlePlay(index)}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handlePlay(index)}
                type="button"
                className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full border border-white/40 bg-black/50 p-2.5 text-white transition hover:bg-black/70 active:scale-90"
              >
                <Play size={16} />
              </motion.button>
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                <p className="text-xs sm:text-sm font-bold leading-tight text-white">{item.caption}</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-300">{item.likes}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReelsSection
