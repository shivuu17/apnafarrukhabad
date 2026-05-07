// Framer Motion Animation Presets
import { motion } from 'framer-motion'

// Predefined animation variants
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  fadeInDelay: (delay = 0.1) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay }
  }),

  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  slideUpDelay: (delay = 0.1) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut', delay }
  }),

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },

  scaleInDelay: (delay = 0.1) => ({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay }
  }),

  // Stagger container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },

  // Card hover lift
  cardHover: {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { y: 0 }
  },

  // Button press
  buttonPress: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  },

  // Loading pulse
  pulse: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 2, repeat: Infinity }
  },

  // Shimmer effect
  shimmer: {
    animate: { x: ['100%', '-100%'] },
    transition: { duration: 2, repeat: Infinity }
  },

  // Page transition
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
}

// Container variants for staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

// Item variants for staggered children
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

// Scroll reveal animation
export const scrollReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 }
}

// Tab slide animation
export const tabSlide = {
  animate: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  }),
  initial: {
    x: 500,
    opacity: 0,
    zIndex: 0
  },
  transition: {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 }
  }
}

export default animations
