import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Centinela México
        bg: {
          base: "#080d0b",
          surface: "#0f1712",
          elevated: "#162019",
        },
        border: {
          DEFAULT: "#1e2e24",
          subtle: "#152019",
        },
        green: {
          50: "#e8f5ed",
          100: "#c7e8d2",
          200: "#92d0a8",
          300: "#5cb87e",
          400: "#3d9e5e",
          500: "#2d7a47",    // verde militar principal
          600: "#235e37",
          700: "#1a4529",
          800: "#112e1b",
          900: "#081a0f",
          DEFAULT: "#2d7a47",
        },
        guinda: {
          50: "#fce8ec",
          100: "#f7c5ce",
          200: "#ed8a9a",
          300: "#df5066",
          400: "#c5253e",
          500: "#9b1a30",    // guinda institucional
          600: "#7a1425",
          700: "#590e1a",
          800: "#380810",
          900: "#1c0308",
          DEFAULT: "#9b1a30",
        },
        cobre: {
          50:  "#fdf3e8",
          100: "#f9ddb8",
          200: "#f2bc7a",
          300: "#e89440",
          400: "#d4945a",
          500: "#b87340",   // cobre principal
          600: "#8f5830",
          700: "#6b4023",
          800: "#462916",
          900: "#23140b",
          DEFAULT: "#b87340",
        },
        text: {
          DEFAULT: "#d1e0d8",
          muted: "#7a9486",
          faint: "#3d5548",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(45,122,71,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(45,122,71,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
