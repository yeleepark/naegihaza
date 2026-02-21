import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)', '"Press Start 2P"', 'monospace'],
        game: ['var(--font-jua)', '"Jua"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
