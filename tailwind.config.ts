import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        char: {
          950: "#120F0D",
          900: "#1C1815",
          800: "#241F1B",
          700: "#2E2722",
        },
        smoke: "#2A2420",
        cream: "#EFE8DB",
        parchment: "#DCD2BC",
        ember: {
          400: "#D97A3F",
          500: "#C1602A",
          600: "#A34E22",
          700: "#7E3B19",
        },
        gold: {
          400: "#E2BD79",
          500: "#D4A24C",
          600: "#B3843A",
        },
        moss: "#5B6B4F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      backgroundImage: {
        grain: "url('/grain.png')",
      },
      maxWidth: {
        prose2: "68ch",
      },
      boxShadow: {
        ember: "0 8px 30px -10px rgba(193, 96, 42, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
