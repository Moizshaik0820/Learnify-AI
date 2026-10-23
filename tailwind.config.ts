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
        surface: "var(--surface)",
        navy: {
          900: "#0D1326",
          800: "#141C38",
          700: "#1E2749",
          600: "#2A3660",
          DEFAULT: "#141C38",
        },
        brand: {
          purple: "#7C3AED",
          "purple-light": "#8B5CF6",
          "purple-subtle": "#F3E8FF",
          blue: "#2563EB",
          "blue-light": "#3B82F6",
          "blue-subtle": "#EFF6FF",
          cyan: "#06B6D4",
          "cyan-light": "#22D3EE",
          "cyan-subtle": "#ECFEFF",
        },
        border: "var(--border-color)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(20, 28, 56, 0.04)",
        "card-hover": "0 8px 24px rgba(20, 28, 56, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
