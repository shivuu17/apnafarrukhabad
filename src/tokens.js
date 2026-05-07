// Design Tokens for ApnaFarrukhabad
// Complete visual identity system

export const colors = {
  // Primary: Deep Green (Trust + Farming + Growth)
  green: {
    50: '#eef8f3',
    100: '#d6ede3',
    200: '#a9dcc4',
    300: '#7ccba5',
    400: '#4fba86',
    500: '#22a967',
    600: '#1a8852',
    700: '#12673d',
    800: '#0a4628',
    900: '#022513'
  },
  
  // Secondary: Earth Brown (Rural Authenticity)
  brown: {
    50: '#faf5f1',
    100: '#f2e9e0',
    200: '#e0d1c3',
    300: '#cdb5a0',
    400: '#b9937d',
    500: '#a57a61',
    600: '#8f6549',
    700: '#6f4f36',
    800: '#523829',
    900: '#3d281d'
  },
  
  // Accent: Soft Saffron (Indian Warmth)
  saffron: {
    50: '#fff8e6',
    100: '#ffedcc',
    200: '#ffd99a',
    300: '#ffc566',
    400: '#ffb133',
    500: '#ff9d00',
    600: '#e68a00',
    700: '#cc7700',
    800: '#994400',
    900: '#662d00'
  },
  
  // Neutral: Grays
  neutral: {
    white: '#ffffff',
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716f',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    black: '#000000'
  },
  
  // Semantic
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
  
  // Glass
  glass: {
    white: 'rgba(255, 255, 255, 0.85)',
    whiteHeavy: 'rgba(255, 255, 255, 0.95)',
    dark: 'rgba(0, 0, 0, 0.4)'
  }
}

export const typography = {
  // Font families
  font: {
    sans: "'Manrope', 'Segoe UI', Roboto, sans-serif",
    serif: "'Georgia', serif",
    mono: "'Courier New', monospace"
  },
  
  // Font sizes (px)
  size: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px'
  },
  
  // Line heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75'
  },
  
  // Letter spacing (em)
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em'
  },
  
  // Font weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  // Text styles
  styles: {
    displayXL: {
      size: '48px',
      weight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    displayL: {
      size: '36px',
      weight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    headingXL: {
      size: '30px',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    headingL: {
      size: '24px',
      weight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    headingM: {
      size: '20px',
      weight: 700,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },
    headingS: {
      size: '18px',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em'
    },
    bodyL: {
      size: '18px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em'
    },
    body: {
      size: '16px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em'
    },
    bodyS: {
      size: '14px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em'
    },
    caption: {
      size: '12px',
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em'
    },
    micro: {
      size: '12px',
      weight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.02em'
    }
  }
}

export const spacing = {
  // Spacing tokens (px)
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px'
}

export const radius = {
  none: '0px',
  xs: '8px',
  sm: '12px',
  base: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  pill: '999px'
}

export const shadows = {
  none: 'none',
  soft: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04)',
  medium: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  premium: '0 20px 25px rgba(0, 0, 0, 0.12), 0 8px 12px rgba(0, 0, 0, 0.08)',
  floating: '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1)',
  glass: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  hover: '0 15px 30px rgba(0, 0, 0, 0.12)',
  pressed: '0 4px 8px rgba(0, 0, 0, 0.08)'
}

export const breakpoints = {
  xs: '320px',
  sm: '390px',
  md: '540px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px'
}

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1010,
  fixed: 1020,
  backdrop: 1030,
  offcanvas: 1040,
  modal: 1050,
  popover: 1060,
  notification: 1070,
  floating: 1080
}

export const transitions = {
  fast: '100ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear'
  }
}

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
  zIndex,
  transitions
}
