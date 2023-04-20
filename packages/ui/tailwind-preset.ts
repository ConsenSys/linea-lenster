/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const LineaCyan = {
  ...colors.cyan,
  500: '#61dfff'
};

// colors: {
//   primary: '#61DFFF',
//   white: '#fff',
//   gray: '#C0C0C0',
//   card: '#505050',
//   cardBg: '#1D1D1D',
//   darker: '#121212'
// },
// fontFamily: {
//   atyp: ['var(--font-atyp)'],
//   atyptext: ['var(--font-atyp-text)']
// }

module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      xs: '300px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        gray: colors.zinc,
        brand: LineaCyan,
        green: colors.emerald,
        cyan: LineaCyan,
        dark: '#1D1D1D',
        darker: '#121212'
      }
    }
  },
  variants: {
    extend: {}
  }
};
