import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18352d",
        forest: "#176b52",
        moss: "#dce9df",
        cream: "#faf8f1",
        sand: "#eee8d9",
        gold: "#c69b52"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        arabic: ["Amiri", "Noto Naskh Arabic", "serif"]
      },
      boxShadow: {
        soft: "0 12px 40px rgba(24, 53, 45, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
