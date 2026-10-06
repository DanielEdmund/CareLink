/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // CareLink design tokens — colour psychology lives here.
        brand: {
          blue: '#155EEF', // trust, reliability, professionalism, safety
          'blue-dark': '#0F4BC4',
          'blue-soft': '#E8F3FF', // soft sky — information panels
          aqua: '#0E9F9A', // calm, healing, progress
          'aqua-dark': '#0B8480',
          'aqua-soft': '#E7F8F3', // mint — completed states
          mint: '#E7F8F3',
          sky: '#E8F3FF',
          navy: '#101828', // headings, important information
          slate: '#475467', // supporting text, metadata
        },
        status: {
          success: '#12B76A',
          warning: '#F79009',
          emergency: '#D92D20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)',
        'card-hover': '0 4px 8px rgba(16, 24, 40, 0.06), 0 12px 28px rgba(16, 24, 40, 0.10)',
        pill: '0 1px 3px rgba(16, 24, 40, 0.08)',
        modal: '0 24px 64px rgba(16, 24, 40, 0.22)',
        glow: '0 0 0 6px rgba(14, 159, 154, 0.12)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.5rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
