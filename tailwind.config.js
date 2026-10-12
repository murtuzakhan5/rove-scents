/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF9F1',
          100: '#F6F1DF',
          200: '#EBDDB7',
          300: '#DFC78A',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A38036',
          700: '#7E6023',
          800: '#554014',
          900: '#2C2009',
        },
        dark: {
          950: '#0A0A0A',
          900: '#121212',
          850: '#171717',
          800: '#202020',
          700: '#2A2A2A',
          600: '#383838'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'Montserrat', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
