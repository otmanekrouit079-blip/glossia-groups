import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        warm: "#FAF7F2",
        brass: "#B8863B",
        ember: "#D8432E",
        deepgreen: "#3D7A57",
        textmain: "#1E1E1C",
        textmuted: "#6E6A63",
        borderline: "#E6E0D4"
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
