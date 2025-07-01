/**
 * Tailwind CSS configuration for PhysiqueAnalytics.
 * Defines custom animations, colors, and spacing to ensure consistency across components
 * (PhysiqueAuth, PhysiqueGoalsSection, App, etc.).
 * Supports fade-in, dropdown, and pulse animations for UI transitions and loading states.
 */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom animations for component transitions and loading states
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'dropdown': 'dropdown 0.3s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dropdown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Custom colors for consistent theming
      colors: {
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2A44',
        },
        amber: {
          500: '#F59E0B',
        },
        green: {
          500: '#10B981',
        },
      },
      // Custom spacing for responsive layouts
      spacing: {
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
      },
    },
  },
  plugins: [],
};