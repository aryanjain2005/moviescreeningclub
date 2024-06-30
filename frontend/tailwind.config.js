/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react'
// const withMT = require("@material-tailwind/react/utils/withMT");
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        monts: ['"Montserrat"', 'sans-serif']
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
}
