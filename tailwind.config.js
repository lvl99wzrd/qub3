/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    fontFamily: {
      mono: ['Space Mono', 'monospace'],
    },
    extend: {
      colors: {
        neon: '#fc2173',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
