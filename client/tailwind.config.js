/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#020617',
        cardBg: 'rgba(17, 34, 64, 0.4)',
        gold: '#c8a84b',
        goldHover: '#b6963f',
        accent: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
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
