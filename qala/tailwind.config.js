/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F0F10',
        stone: '#111315',
        gold: '#C9A35B',
      },
      fontFamily: {
        display: ['ui-serif', 'Georgia', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}

