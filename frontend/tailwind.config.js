/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Add this line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6fffe',
          100: '#ccfffd',
          200: '#99fffb',
          300: '#66fff9',
          400: '#33fff7',
          500: '#00f2ea',
          600: '#00c2bb',
          700: '#00918c',
          800: '#00615e',
          900: '#00302f',
        },
        success: {
          50: '#e6faf9',
          100: '#ccf5f3',
          200: '#99ebe7',
          300: '#66e1db',
          400: '#33d7cf',
          500: '#00b8b8',
          600: '#009393',
          700: '#006e6e',
          800: '#004a4a',
          900: '#002525',
        },
        dark: {
          50: '#2d2d2d',
          100: '#262626',
          200: '#1f1f1f',
          300: '#1a1a1a',
          400: '#151515',
          500: '#111111',
          600: '#0d0d0d',
          700: '#0a0a0a',
          800: '#080808',
          900: '#000000',
        }
      },
    },
  },
  plugins: [],
}
