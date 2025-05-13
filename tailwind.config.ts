import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        lesson: {
          blue: {
            bg: "#EFF6FF",
            text: "#2563EB",
            border: "#BFDBFE",
          },
          purple: {
            bg: "#F3E8FF",
            text: "#9333EA",
          },
          green: {
            bg: "#DCFCE7",
            text: "#16A34A",
          },
          orange: {
            bg: "#FFF7ED",
            text: "#EA580C",
          },
        },
        admin: {
          blue: {
            light: "#EFF6FF", // blue-100
            DEFAULT: "#2563EB", // blue-600
            dark: "#1D4ED8", // blue-700
          },
          gray: {
            lightest: "#F9FAFB", // gray-50
            light: "#E5E7EB", // gray-200
            DEFAULT: "#6B7280", // gray-500
            dark: "#1F2937", // gray-800
            darker: "#111827", // gray-900
          },
          green: {
            light: "#D1FAE5", // green-100
            dark: "#065F46", // green-800
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
