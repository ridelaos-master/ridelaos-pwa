/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'rl-green': '#1A3A2A',       /* Primary */
        'rl-green-mid': '#2D6A4F',   /* Secondary */
        'rl-orange': '#F4A261',       /* Accent */
        'rl-success': '#D8F3DC',
        'rl-error': '#FADBD8',
        'rl-bg': '#F5F5F5',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '16px',
        btn: '8px',
      },
      fontFamily: {
        sans: ['Arial', 'Malgun Gothic', 'Apple SD Gothic Neo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
