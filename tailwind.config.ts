import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040b14",
          900: "#08172b",
          800: "#0d2746"
        },
        steel: "#8fa9c4",
        accent: "#d1a95f"
      }
    }
  },
  plugins: []
} satisfies Config;
