import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#FFFFFF",
        warm: "#071A2B",
        "surface-alt": "#0B2438",
        "card-bg": "#0E2B40",
        "deep-blue": "#0D3047",
        brass: "#FF6B1A",
        "brass-soft": "#FF8A3D",
        "brass-dark": "#E85A12",
        ember: "#EF4444",
        deepgreen: "#22C55E",
        textmain: "#E7EEF3",
        textmuted: "#A9BAC7",
        borderline: "rgba(255,255,255,0.08)"
      },
      fontFamily: {
        heading: ["Manrope", "Tajawal", "sans-serif"],
        body: ["Manrope", "Tajawal", "sans-serif"],
        digits: ["Manrope", "Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
