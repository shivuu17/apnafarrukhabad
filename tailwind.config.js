/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#edf9f1',
          100: '#d8f0df',
          500: '#2b8f5f',
          700: '#1d6a45',
          900: '#0f3d2d'
        },
        saffron: {
          400: '#ef9346',
          500: '#e47522',
          600: '#bf5f1c'
        },
        navy: {
          900: '#111f3a'
        }
      },
      boxShadow: {
        soft: '0 10px 25px rgba(17, 31, 58, 0.08)',
        glow: '0 10px 28px rgba(43, 143, 95, 0.22)'
      },
      borderRadius: {
        card: '22px'
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(180deg, rgba(6,10,17,0.08), rgba(6,10,17,0.75))'
      }
    }
  },
  plugins: []
}
