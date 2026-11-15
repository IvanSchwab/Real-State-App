import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-green': '#647C64',
        // Tokens del rediseño (app/styles/tokens.css). Prefijo "ol" para no pisar
        // las paletas green/gray de Tailwind que usan las pantallas aún no migradas.
        ol: {
          green: 'var(--green)',
          'green-d': 'var(--green-d)',
          sage: 'var(--sage)',
          mist: 'var(--mist)',
          wa: 'var(--wa)',
          'wa-hover': 'var(--wa-hover)',
          paper: 'var(--paper)',
          ink: 'var(--ink)',
          muted: 'var(--muted)',
          line: 'var(--line)',
          footer: 'var(--footer)',
          yellow: 'var(--brand-yellow)',
          mint: 'var(--brand-mint)',
        },
      },
      fontFamily: {
        quicksand: ['var(--font-body)'],
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        control: 'var(--r-control)',
        button: 'var(--r-button)',
        card: 'var(--r-card)',
        panel: 'var(--r-panel)',
      },
      boxShadow: {
        rest: 'var(--sh-rest)',
        hover: 'var(--sh-hover)',
        'card-hover': 'var(--sh-card-hover)',
        float: 'var(--sh-float)',
      },
      transitionTimingFunction: {
        ol: 'var(--ease)',
      },
    },
  },
  plugins: [],
} satisfies Config;
