import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        "surface-elevated": "var(--surface-elevated)",
        // Light & Dark Semantic Tokens
        "cloud-white": "#F8FAFC",
        "pixel-blue": {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          active: "#1D4ED8",
          subtle: "#EFF6FF",
          light: "#60A5FA",
          dark: "#60A5FA",
        },
        "grass-green": {
          DEFAULT: "#22A447",
          hover: "#1B873A",
          light: "#DCFCE7",
          subtle: "#F0FDF4",
          border: "#86EFAC",
          dark: "#4ADE80",
        },
        "golden-yellow": {
          DEFAULT: "#FACC15",
          hover: "#EAB308",
          light: "#FEF9C3",
          subtle: "#FEFCE8",
          dark: "#A16207",
        },
        "coral-orange": {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          light: "#FFEDD5",
          subtle: "#FFF7ED",
          dark: "#FB923C",
        },
        "dark-slate": {
          DEFAULT: "#1E293B",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        "light-gray": {
          DEFAULT: "#E2E8F0",
          border: "#E2E8F0",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
        },
        "sky-blue": {
          DEFAULT: "#DBEAFE",
          hover: "#BFDBFE",
          text: "#1D4ED8",
          dark: "#1E3A5F",
          "dark-text": "#93C5FD",
        },
        navy: {
          950: "#0B0F19",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          DEFAULT: "#1E293B",
        },
        border: "var(--border-color)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(30, 41, 59, 0.04)",
        "card-hover": "0 8px 24px rgba(30, 41, 59, 0.08)",
        podium: "0 10px 30px -5px rgba(59, 130, 246, 0.15)",
        "dark-card": "0 2px 12px rgba(0, 0, 0, 0.25)",
        "dark-elevated": "0 8px 30px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
