/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#111111', fintech: '#ffd84d' },
      boxShadow: { soft: '0 18px 45px rgba(17,17,17,.08)' }
    }
  },
  plugins: []
};
