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
        "ps-coral": "oklch(0.6171 0.1375 39.0427)",
        "ps-teal": "oklch(0.64 0.116 174.2)",
        "ps-purple": "oklch(0.6898 0.1581 290.4107)",
        "ps-warm": "oklch(0.9818 0.0054 95.0986)",
        "ps-surface": "oklch(0.9245 0.0138 92.9892)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
