/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    extend: {
      colors: {
        'yp-orange': '#f9ac2b',
        'yp-secondary-orange': '#bd8222',
        'yp-blue': '#10abbb',
        'yp-secondary-blue': '#0c6d78',
        'yp-red': '#f15156',
        'disabled-grey': '#999490',
        'disabled-grey-hover': '#7a7774',
      },
    },
  },
  plugins: [],
};
