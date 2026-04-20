/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#04060e',
        cardBg: 'rgba(255, 255, 255, 0.03)',
        gold: '#c8a84b',
        goldHover: '#b6963f',
        accent: '#d4af37',
        success: '#10b981',
        danger: '#ef4444',
        textPrimary: '#f8fafc',
        textSecondary: '#64748b',
        muted: '#1e293b',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'aurora': 'aurora 60s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'aurora': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5, filter: 'blur(40px)' },
          '50%': { opacity: 0.8, filter: 'blur(20px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
