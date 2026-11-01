/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors from logo
        'inkosi-gold': {
          DEFAULT: '#C5A028',
          light: '#D4B84A',
          dark: '#8B6E1C',
        },
        'inkosi-navy': {
          DEFAULT: '#1B2A4A',
          light: '#2A4070',
          dark: '#0F1A2E',
        },
        'inkosi-cream': {
          DEFAULT: '#F5F0E1',
          dark: '#E8E0CC',
        },
        'inkosi-teal': {
          DEFAULT: '#2B6B5C',
          light: '#418B78',
        },
        'inkosi-dark': '#0F1A2E',
        'inkosi-gray': '#6B7280',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C5A028 0%, #8B6E1C 100%)',
        'gradient-navy': 'linear-gradient(135deg, #1B2A4A 0%, #0F1A2E 100%)',
        'gradient-teal': 'linear-gradient(135deg, #2B6B5C 0%, #1A4A3F 100%)',
        'hero-pattern': "radial-gradient(circle at 10% 20%, rgba(197,160,40,0.05) 0%, rgba(27,42,74,0.08) 100%)",
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(197,160,40,0.2)',
        'gold-lg': '0 10px 25px -5px rgba(197,160,40,0.3)',
      },
    },
  },
  plugins: [],
}