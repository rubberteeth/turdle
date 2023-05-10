/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['bubble', 'quicksand', 'monospace'],
        quicksand: ['quicksand', 'cinzel', 'monospace'],
        pen: ['pen', 'quicksand', 'monospace'],
        cinzel: ['cinzel', 'quicksand', 'monospace']
      }
    },
  },
  plugins: [],
}

