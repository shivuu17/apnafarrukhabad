import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { animations } from '../../animations'

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-neutral-400',
      secondary:
        'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 active:bg-neutral-400 disabled:bg-neutral-100',
      outline:
        'border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 disabled:border-neutral-300 disabled:text-neutral-400',
      ghost:
        'text-green-600 hover:bg-green-50 active:bg-green-100 disabled:text-neutral-400',
      glass:
        'bg-white/30 text-white backdrop-blur-md border border-white/20 hover:bg-white/40 active:bg-white/50',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-neutral-400',
      success:
        'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-neutral-400',
      warning:
        'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 disabled:bg-neutral-400',
      gradient:
        'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900'
    }

    const sizes = {
      xs: 'px-4 py-1.5 text-xs font-bold gap-1.5',
      sm: 'px-4 py-2 text-sm font-semibold gap-2',
      md: 'px-5 py-2.5 text-sm font-semibold gap-2',
      lg: 'px-6 py-3 text-base font-semibold gap-3',
      xl: 'px-8 py-4 text-lg font-bold gap-3'
    }

    const baseClass = `inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer ${
      fullWidth ? 'w-full' : ''
    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`

    return (
      <motion.button
        ref={ref}
        {...(disabled ? {} : animations.buttonPress)}
        disabled={disabled || loading}
        className={`${baseClass} ${variants[variant]} ${sizes[size]}`}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-neutral-200 border-t-green-600 rounded-full animate-spin" />
            <span className="hidden sm:inline">{children}</span>
          </>
        ) : Icon ? (
          <>
            {iconPosition === 'left' && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            {iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
