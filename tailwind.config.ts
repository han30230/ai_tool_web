import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563eb", dark: "#1d4ed8" },
        surface: { light: "#f8fafc", dark: "#0f172a" },
      },
    },
  },
  plugins: [],
};
export default config;
