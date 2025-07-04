/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-cyan': '#00FFFF',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};