/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0b0b0b',
          lighter: '#111111',
          border: '#1a1a1a',
        },
        accent: {
          blue: '#4A90E2',
          purple: '#9C27B0',
          pink: '#E91E63',
          green: '#4CAF50',
          orange: '#FF6F00',
          cyan: '#00BCD4',
          yellow: '#FFC107',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 144, 226, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}