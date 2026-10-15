/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mochi: { cream: '#fff9f3', peach: '#ffb899', lav: '#c9b6ff', mint: '#aee8d2', pink: '#ffb3d1', sky: '#b8e0ff', butter: '#fff0b3', ink: '#4a3b52', muted: '#9a8aa3', line: '#f1e3dc' },
      },
      fontFamily: { display: ['var(--font-baloo)', 'ui-rounded', 'sans-serif'], body: ['var(--font-nunito)', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 10px 30px rgba(255,184,153,.25)', pop: '0 6px 0 rgba(74,59,82,.12)' },
      keyframes: {
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pop: { from: { opacity: 0, transform: 'scale(.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
        rise: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: { bob: 'bob 3s ease-in-out infinite', pop: 'pop .25s ease both', rise: 'rise .45s ease both' },
    },
  },
  plugins: [],
};
