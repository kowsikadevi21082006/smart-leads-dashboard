/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F0F0F",
        surface: "#1A1A1A",
        "surface-2": "#1A1A1A",
        accent: "#D4FF00",
        border: "#2A2A2A",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A3A3A3",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212,255,0,0.18), 0 0 24px rgba(212,255,0,0.14)",
        card: "0 18px 48px rgba(0, 0, 0, 0.32)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
