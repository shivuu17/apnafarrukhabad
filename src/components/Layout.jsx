import React from 'react'
import { motion } from 'framer-motion'
import { animations, scrollReveal } from '../animations'

// Container - Responsive width constraint
export const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    sm: 'max-w-xs sm:max-w-md md:max-w-2xl',
    default: 'max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl',
    lg: 'max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-6xl xl:max-w-7xl',
    full: 'w-full'
  }
  return (
    <div className={`mx-auto w-full px-3 sm:px-4 ${sizes[size]} ${className}`}>
      {children}
    </div>
  )
}

// Stack - Vertical flex layout
export const Stack = ({ children, gap = 4, className = '', ...props }) => {
  const gapMap = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }
  return (
    <div className={`flex flex-col ${gapMap[gap]} ${className}`} {...props}>
      {children}
    </div>
  )
}

// HStack - Horizontal flex layout
export const HStack = ({ children, gap = 4, className = '', ...props }) => {
  const gapMap = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }
  return (
    <div className={`flex flex-row items-center ${gapMap[gap]} ${className}`} {...props}>
      {children}
    </div>
  )
}

// Grid - Responsive grid layout
export const Grid = ({ children, cols = 2, gap = 4, className = '', ...props }) => {
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  }
  const gapMap = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6'
  }
  return (
    <div className={`grid ${colMap[cols]} ${gapMap[gap]} ${className}`} {...props}>
      {children}
    </div>
  )
}

// Spacer - Vertical spacing
export const Spacer = ({ size = 4 }) => {
  const sizeMap = {
    1: 'h-1',
    2: 'h-2',
    3: 'h-3',
    4: 'h-4',
    6: 'h-6',
    8: 'h-8'
  }
  return <div className={sizeMap[size]} />
}

// Divider - Visual separator
export const Divider = ({ className = '' }) => (
  <div className={`h-px bg-neutral-200 ${className}`} />
)

// ScrollReveal - Animated on scroll
export const ScrollReveal = ({ children, className = '' }) => (
  <motion.div {...scrollReveal} className={className}>
    {children}
  </motion.div>
)

// Badge component
export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    breaking: 'bg-red-600 text-white',
    verified: 'bg-green-600 text-white',
    trending: 'bg-orange-600 text-white'
  }
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-bold',
    md: 'px-3 py-1 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-bold'
  }
  return (
    <span className={`inline-block rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

// Chip component
export const Chip = ({
  label,
  onClose,
  variant = 'default',
  className = '',
  onClick,
  selected = false
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    active: 'bg-green-600 text-white border-green-600',
    selected: selected
      ? 'bg-green-600 text-white border-green-600'
      : 'bg-neutral-100 text-neutral-800 border-neutral-200'
  }
  return (
    <motion.button
      {...animations.buttonPress}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {label}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="hover:opacity-70"
        >
          ✕
        </button>
      )}
    </motion.button>
  )
}

// Avatar component
export const Avatar = ({ src, name, size = 'md', verified = false, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className={`${sizes[size]} rounded-full object-cover border-2 border-neutral-100`}
        />
      ) : (
        <div
          className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 font-bold text-white`}
        >
          {initials}
        </div>
      )}
      {verified && (
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
          ✓
        </div>
      )}
    </div>
  )
}

// Text component
export const Text = ({ children, variant = 'body', className = '', ...props }) => {
  const variants = {
    displayXL: 'text-5xl font-extrabold tracking-tight',
    displayL: 'text-4xl font-extrabold tracking-tight',
    headingXL: 'text-3xl font-bold tracking-tight',
    headingL: 'text-2xl font-bold tracking-tight',
    headingM: 'text-xl font-bold',
    headingS: 'text-lg font-semibold',
    bodyL: 'text-lg font-normal',
    body: 'text-base font-normal',
    bodyS: 'text-sm font-normal',
    caption: 'text-xs font-semibold uppercase tracking-wide',
    micro: 'text-xs font-bold uppercase tracking-wider'
  }
  const element = {
    displayXL: 'h1',
    displayL: 'h1',
    headingXL: 'h2',
    headingL: 'h2',
    headingM: 'h3',
    headingS: 'h4',
    other: 'p'
  }
  const Element = element[variant] || element.other
  return (
    <Element className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </Element>
  )
}

// Card component
export const Card = ({ children, className = '', hover = true, glass = false, animated = true }) => {
  const baseClass = `rounded-2xl border border-neutral-200 shadow-soft ${
    glass ? 'bg-white/50 backdrop-blur-md' : 'bg-white'
  } ${hover ? 'hover:shadow-medium transition-shadow' : ''} ${className}`

  return animated ? (
    <motion.div {...animations.cardHover} className={baseClass}>
      {children}
    </motion.div>
  ) : (
    <div className={baseClass}>{children}</div>
  )
}

// Section component
export const Section = ({ children, title, subtitle, className = '', ...props }) => (
  <section className={`py-6 sm:py-8 ${className}`} {...props}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <Text variant="headingL">{title}</Text>}
        {subtitle && <Text variant="bodyS" className="text-neutral-600 mt-1">{subtitle}</Text>}
      </div>
    )}
    {children}
  </section>
)

// Animation wrapper
export const AnimatedWrapper = ({ children, variant = 'fadeIn', delay = 0 }) => (
  <motion.div {...animations[variant] || animations.fadeIn} transition={{ delay }}>
    {children}
  </motion.div>
)

export default {
  Container,
  Stack,
  HStack,
  Grid,
  Spacer,
  Divider,
  ScrollReveal,
  Badge,
  Chip,
  Avatar,
  Text,
  Card,
  Section,
  AnimatedWrapper
}
