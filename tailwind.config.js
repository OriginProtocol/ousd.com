/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        ousd: "0px 4px 56px rgba(20, 21, 25, 0.9)",
      },
      colors: {
        "origin-bg-black": "#141519",
        "origin-bg-blackt": "#141519cc",
        "origin-bg-dgrey": "#18191c",
        "origin-bg-grey": "#1e1f25",
        "origin-bg-greyt": "#1e1f25b3",
        "origin-white": "#fafbfb",
        "gradient2-from": "#8c66fc33",
        "gradient2-to": "#0274f133",
        "body-grey": "#8493a6",
        "range-border": "#3a3d4d",
        "table-title": "#828699",
        "table-data": "#ebecf2",
        "hover-bg": "#222329",
        subheading: "#b5beca",
        tooltip: "#1e1f25",
        "origin-border": "#272727",
        "origin-blue": "#0074f0",
        hover: "#020203",
        "white-grey": "#d8dae5",
        blurry: "#fafbfb",
        footer2: "#111115",
        "gradient1-from": "#fedba8",
        "gradient1-fromt": "#fedba833",
        "gradient1-to": "#cf75d5",
        "gradient1-tot": "#cf75d533",
      },
      boxShadow: {
        tooltip: "0px 6px 12px #000000",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },

  plugins: [],
};
