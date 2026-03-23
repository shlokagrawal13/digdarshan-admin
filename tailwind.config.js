/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: '#eef0f5', // Soft, modern light gray
        primary: '#9ebca6', // Muted pastel green
        secondary: '#a3b8cc', // Muted pastel blue
        danger: '#d6a3a3', // Muted pastel red
        textmain: '#4a5568', // Soft dark gray for text
      },
      boxShadow: {
        'neu': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 8px #d1d5db, -4px -4px 8px #ffffff',
        'neu-pressed': 'inset 6px 6px 12px #d1d5db, inset -6px -6px 12px #ffffff',
        'neu-pressed-sm': 'inset 3px 3px 6px #d1d5db, inset -3px -3px 6px #ffffff',
        'glass': '0 8px 32px 0 rgba(255, 255, 255, 0.4)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
