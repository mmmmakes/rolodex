/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        gold: 'var(--gold)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
      },
    },
  },
  plugins: [],
}
