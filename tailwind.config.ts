// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
    "./*.ts{,x}",
    "./public/**/*.html",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "logo-purple": "hsl(var(--logo-purple))",
        "logo-cyan": "hsl(var(--logo-cyan))",
        "logo-gradient":
          "linear-gradient(135deg, hsl(var(--logo-purple)), hsl(var(--logo-cyan)))",
      },
      backgroundImage: {
        "logo-gradient":
          "linear-gradient(135deg, hsl(var(--logo-purple)), hsl(var(--logo-cyan)))",
        "logo-purple-radial":
          "radial-gradient(circle at center, hsl(var(--logo-purple) / 0.2), transparent)",
        "logo-cyan-radial":
          "radial-gradient(circle at center, hsl(var(--logo-cyan) / 0.2), transparent)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "logo-sm":
          "0 1px 3px hsl(var(--logo-purple) / 0.1), 0 1px 2px hsl(var(--logo-cyan) / 0.05)",
        "logo-md":
          "0 4px 6px -1px hsl(var(--logo-purple) / 0.1), 0 2px 4px -1px hsl(var(--logo-cyan) / 0.05)",
        "logo-lg":
          "0 10px 15px -3px hsl(var(--logo-purple) / 0.1), 0 4px 6px -2px hsl(var(--logo-cyan) / 0.05)",
        "logo-xl":
          "0 20px 25px -5px hsl(var(--logo-purple) / 0.15), 0 10px 10px -5px hsl(var(--logo-cyan) / 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse_slow: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition: "400% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse_slow 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      transitionTimingFunction: {
        logo: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDelay: {
        300: "300ms",
        500: "500ms",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      aspectRatio: {
        auto: "auto",
        square: "1/1",
        video: "16/9",
        cube: "1/1",
      },
      zIndex: {
        1: "1",
        10: "10",
        50: "50",
        100: "100",
        150: "150",
        200: "200",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;