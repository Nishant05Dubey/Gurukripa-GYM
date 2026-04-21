/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kgf-primary': '#FF6B35',
        'kgf-secondary': '#1A1A1A',
        'kgf-accent': '#F7931E',
      }
    },
  },
  plugins: [],
}