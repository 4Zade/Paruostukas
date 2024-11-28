import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    extract
  },
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
        },
        'pop-up': {
          '0%, 100%': { transform: 'scale(0)' },
          '4%, 96%': { transform: 'scale(1.1)' },
          '5%, 95%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'pop-up': 'pop-up 5s ease-in-out',
      },
    },
    screens,
    fontSize,
  },
  plugins: [
    fluid
  ],
}