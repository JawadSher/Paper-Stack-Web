import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ps-coral": "#CF6679",
        "ps-teal": "#2DB896",
        "ps-purple": "#7C6FF7",
        "ps-warm": "#FAF9F7",
        "ps-surface": "#F1EFE8",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
