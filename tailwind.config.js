/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      dropShadow: {
        'ousd': '0px 4px 56px rgba(20, 21, 25, 0.9)',
      }
    }
  },
  plugins: [],
}
