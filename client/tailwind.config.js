// ©️ Mewn — Neo-Brutalism Design System for Candid
// Why bold/raw/not boring:
// 1. RAW HONESTY — thick 4px ink borders + 8px hard shadows expose structure, no blur/gradient hiding.
// 2. HIGH-CONTRAST POP — ink #0A0A0A on paper #FFFDF9 with safety yellow/cobalt/red/lime as functional signal, not decoration.
// 3. CHUNKY PHYSICS — brutal press (scale 0.97, shadow 2px) gives tactile snap; everything feels buildable.
// 4. TYPOGRAPHIC SHOUT — Space Grotesk bold all-caps labels + JetBrains Mono; tight tracking, 1px ink outlines.
// 5. GRID AS FEATURE — exposed 8px grid, hard 0-8px radius, offset cards — anti-pretty, unforgettable.

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brutal core
        ink: {
          DEFAULT: '#0A0A0A',
          950: '#0A0A0A',
          900: '#141414',
          800: '#1F1F1F',
          700: '#2B2B2B',
          600: '#3A3A3A',
          500: '#6B6B6B',
          400: '#9A9A9A',
          300: '#D1D1D1',
          200: '#EAEAEA',
          100: '#F5F5F5',
        },
        paper: {
          DEFAULT: '#FFFDF9',
          50: '#FFFDF9',
          100: '#FFFDF9',
          200: '#FFF8E6',
          300: '#FFF0CC',
          400: '#FFE9B3',
          border: '#0A0A0A',
        },
        cream: '#FFFDF9',
        brutal: {
          yellow: '#FFD60A',
          yellowHover: '#FFC800',
          red: '#FF3B30',
          redHover: '#E6362B',
          cobalt: '#0A84FF',
          cobaltHover: '#0066CC',
          lime: '#30D158',
          limeHover: '#28B94A',
          pink: '#FF2D92',
          orange: '#FF9500',
        },
        // Signal aliases for component use
        yellow: '#FFD60A',
        cobalt: '#0A84FF',
        lime: '#30D158',
        // Back-compat: map old cozy tokens -> brutal so legacy classes still render stark
        clay: {
          DEFAULT: '#FFD60A',
          hover: '#FFC800',
          light: '#FFF0CC',
          subtle: '#FFF8E6',
          dark: '#0A0A0A',
        },
        pine: {
          DEFAULT: '#0A0A0A',
          hover: '#1F1F1F',
          light: '#EAEAEA',
          subtle: '#FFFDF9',
          dark: '#0A0A0A',
          100: '#FFFDF9',
          600: '#0A0A0A',
          700: '#0A0A0A',
          800: '#0A0A0A',
        },
        terracotta: { DEFAULT: '#FF3B30', subtle: '#FFF0F0' },
        stone: { 100: '#EAEAEA', 600: '#6B6B6B', 700: '#3A3A3A', 800: '#0A0A0A' },
        wabi: {
          50: '#FFFDF9', 100: '#FFF8E6', 200: '#FFF0CC', 300: '#FFD60A',
          400: '#FFC800', 500: '#FFD60A', 600: '#0A0A0A', 700: '#0A0A0A',
          800: '#0A0A0A', 900: '#0A0A0A', 950: '#0A0A0A',
        },
        surface: {
          50: '#FFFDF9', 100: '#FFFDF9', 200: '#EAEAEA', 300: '#D1D1D1',
          400: '#9A9A9A', 500: '#6B6B6B', 600: '#2B2B2B', 700: '#1F1F1F',
          800: '#141414', 900: '#0A0A0A', 950: '#0A0A0A',
        },
        accent: {
          sand: '#FFD60A', clay: '#FFD60A', pine: '#0A0A0A', stone: '#6B6B6B',
          green: '#30D158', red: '#FF3B30', blue: '#0A84FF', amber: '#FFD60A',
        },
        candid: {
          50: '#FFFDF9', 100: '#FFF8E6', 200: '#FFF0CC', 300: '#FFD60A',
          400: '#FFC800', 500: '#FFD60A', 600: '#0A0A0A', 700: '#0A0A0A',
          800: '#0A0A0A', 900: '#0A0A0A', 950: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        brutal: ['Space Grotesk', 'sans-serif'],
        handwritten: ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['3.75rem', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-md': ['3rem', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['2.25rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '700' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      borderRadius: {
        'brutal-sm': '4px',
        'brutal': '8px',
        'brutal-lg': '8px',
        // legacy organic -> hard
        'organic-sm': '4px',
        organic: '8px',
        'organic-lg': '8px',
        deckle: '4px',
        'radius-sm': '4px',
        'radius-md': '8px',
        'radius-lg': '8px',
        'radius-xl': '8px',
        'radius-2xl': '8px',
      },
      boxShadow: {
        brutal: '8px 8px 0px 0px #0A0A0A',
        'brutal-sm': '4px 4px 0px 0px #0A0A0A',
        'brutal-lg': '12px 12px 0px 0px #0A0A0A',
        'brutal-yellow': '8px 8px 0px 0px #FFD60A',
        'brutal-pressed': '2px 2px 0px 0px #0A0A0A',
        // legacy cozy -> brutal mapping
        'cozy-sm': '4px 4px 0px 0px #0A0A0A',
        cozy: '8px 8px 0px 0px #0A0A0A',
        'cozy-lg': '12px 12px 0px 0px #0A0A0A',
        polaroid: '8px 8px 0px 0px #0A0A0A',
        'inner-lens': 'inset 0 2px 0 #0A0A0A',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.97)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        brutalIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        countdownPop: {
          '0%': { opacity: '0', transform: 'scale(1.5)' },
          '60%': { opacity: '1', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flash: { '0%': { opacity: '0' }, '30%': { opacity: '0.92' }, '100%': { opacity: '0' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        // keep legacy names
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        drift: { '0%, 100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(2px, -2px)' } },
        driftAlt: { '0%, 100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(-2px, 2px)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.85' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        pop: 'pop 120ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        shake: 'shake 300ms ease-in-out',
        'brutal-in': 'brutalIn 180ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        countdown: 'countdownPop 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shutter-flash': 'flash 220ms ease-out forwards',
        marquee: 'marquee 12s linear infinite',
        // legacy aliases
        'fade-in': 'brutalIn 180ms ease-out forwards',
        'slide-up': 'brutalIn 180ms ease-out forwards',
        'drift-slow': 'drift 6s ease-in-out infinite',
        'drift-alt': 'driftAlt 7s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 300ms ease-out',
        'scale-in': 'scaleIn 180ms ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionTimingFunction: {
        brutal: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        organic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        120: '120ms',
        150: '150ms',
        brutal: '120ms',
        fast: '120ms',
        normal: '180ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
}
