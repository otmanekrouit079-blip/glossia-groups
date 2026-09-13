import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        warm: "#f5f5f5",
        "surface-alt": "#fafafa",
        brass: "#ff4747",
        "brass-soft": "#ff7a3d",
        "brass-dark": "#e5342e",
        ember: "#e5342e",
        deepgreen: "#16a34a",
        textmain: "#2b2b2b",
        textmuted: "#767676",
        borderline: "#ececec"
      },
      fontFamily: {
        heading: ["Tajawal", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
        digits: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
