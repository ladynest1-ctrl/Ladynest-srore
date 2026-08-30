/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}", // Added pages for safety
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Added src folder support
  ],
  theme: {
    extend: {
      colors: {
        'ash-white': '#F2F2F2',
        'dark-accent': '#0A0A0A',
        'luxury-gold': '#D4AF37',
        'soft-ash': '#E8E8E8',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Luxury products ke liye best hai
      },
    },
  },
  plugins: [],
};