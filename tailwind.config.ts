import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        form: {
          background: "hsl(var(--form-background))",
          border: {
            DEFAULT: "hsl(var(--border))",
            muted: "hsl(var(--border-muted))",
            accent: "hsl(var(--border-accent))",
          },
          foreground: {
            DEFAULT: "hsl(var(--foreground))",
            accent: "hsl(var(--foreground-accent))",
          },
          input: "hsl(var(--input-background))",
          label: {
            DEFAULT: "hsl(var(--form-label))",
            accent: "hsl(var(--form-label-accent))",
          },
          link: {
            DEFAULT: "hsl(var(--form-link))",
            accent: "hsl(var(--form-link-accent))",
          },
          button: {
            DEFAULT: "hsl(var(--form-button))",
            accent: "hsl(var(--form-button-accent))",
          },
          muted: "hsl(var(--form-muted))",
        },
        tooltip: "hsl(var(--tooltip))",
        lime: "hsl(var(--lime))",
        orange: "hsl(var(--orange))",
        red: "hsl(var(--red))",
        sidebar: {
          DEFAULT: "hsla(var(--sidebar))",
          primary: "hsla(var(--sidebar-primary))",
          border: "hsla(var(--sidebar-border))",
        },
        background: "hsl(var(--background))",
        cream: "hsl(var(--background-cream))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: {
            DEFAULT: "hsl(var(--card-foreground))",
            muted: "hsl(var(--card-foreground-muted))",
          },
          muted: "hsl(var(--card-muted))",
          accent: "hsl(var(--card-accent))",
        },
        calendar: {
          lime: "hsl(var(--calendar-lime))",
          orange: "hsl(var(--calendar-orange))",
          red: "hsl(var(--calendar-red))",
        },
        popover: {
          DEFAULT: "hsla(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          accent: "hsl(var(--popover-accent))",
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

        border: {
          DEFAULT: "hsla(var(--border))",
          muted: "hsla(var(--border-muted))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
} satisfies Config;
