/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a1628',
        cardBg: '#112240',
        gold: '#c8a84b',
        goldHover: '#b6963f',
        textPrimary: '#e6f1ff',
        textSecondary: '#8892b0',
      },
    },
  },
  plugins: [],
}
