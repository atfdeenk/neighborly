/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3E7C59', // Forest Green
          light: '#A3C9A8',   // Moss Green
          dark: '#265C42',    // Deep Forest
        },
        secondary: {
          DEFAULT: '#B6A16B', // Sand
          light: '#EDE6C1',   // Light Sand
          dark: '#8B7B4A',    // Clay
        },
        background: {
          DEFAULT: '#F6F5EC', // Off-White (Eco Paper)
          dark: '#E5E1D8',    // Muted Eco Paper
        },
        text: {
          DEFAULT: '#2C2C2C', // Charcoal
          light: '#6B6B6B',
        },
        accent: {
          DEFAULT: '#A3C9A8', // Moss Green Accent
          sand: '#FFF8E1',    // Sand Accent
        },
        success: {
          DEFAULT: '#4C6B4F', // Olive Green
          light: '#7BAE7F',   // Sage Green
        },
        warning: {
          DEFAULT: '#E8B04B', // Goldenrod
        },
        info: {
          DEFAULT: '#6EC6E6', // Sky Blue
        },
        error: {
          DEFAULT: '#B85C38', // Earthy Red
        },
        highlight: {
          DEFAULT: '#E0F2E9', // Light Green Highlight
        },
      },
    },
  },
  plugins: [],
};
