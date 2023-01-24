/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      dropShadow: {
        'ousd': '0px 4px 56px rgba(20, 21, 25, 0.9)',
      },
      colors: {
        "origin-bg-black": "#141519",
        "origin-bg-grey": "#1e1f25",
        "subheading": "#b5beca",
        tooltip: "#1e1f25",
        "origin-border": "#272727",
        "origin-blue": "#0074f0",
        "hover": "#020203",
      }
    }
  },
  plugins: [],
}
