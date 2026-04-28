import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "calm-forest": "var(--calm-forest)",
        "calm-mist": "var(--calm-mist)",
        "calm-ink": "var(--calm-ink)",
        "calm-white": "var(--calm-white)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "12px",
        input: "8px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
export default config;
