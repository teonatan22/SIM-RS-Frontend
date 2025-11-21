import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f8fbff",
          100: "#e9f4ff",
          200: "#b5dbff",
          300: "#84c2ff",
          400: "#4aa8ff",
          500: "#1f8fff",
          600: "#0f72d9",
          700: "#0a58a8",
          800: "#083f78",
          900: "#04254a",
        },
        accent: {
          100: "#fff4ce",
          200: "#ffe6a1",
          300: "#ffd26d",
          400: "#ffbd3a",
          500: "#ffa200",
        },
        calm: "#eef3f8",
        elderText: "#1c2a39",
      },
      fontSize: {
        "2xl-plus": "1.75rem",
        "3xl-plus": "2.25rem",
      },
      borderRadius: {
        xl: "1.5rem",
      },
      boxShadow: {
        comfort: "0 20px 40px rgba(8, 63, 120, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
