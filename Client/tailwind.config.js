/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#FF6B00", light: "#FF8C38", dark: "#CC5500" },
        gold:    { DEFAULT: "#D4AF37", light: "#F0D060" },
        cream:   "#FDF6E3",
        maroon:  "#6B0F1A",
        temple:  "#3D1C02",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body:    ["Crimson Pro", "serif"],
      },
    },
  },
  plugins: [],
};
