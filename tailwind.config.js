/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0f14",
        surface: "#121822",
        accent: "#4cc2ff",
        accentMuted: "#205c7a",
        border: "#1f2937"
      }
    }
  },
  plugins: []
};
