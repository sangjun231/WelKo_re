import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'grayscale-50': 'var(--Grayscale-50, #F7F7F9)',
        'grayscale-100': 'var(--Grayscale-100, #DFDFE0)',
        'grayscale-500': 'var(--Grayscale-500, #7A7A7A)',
        'grayscale-600': 'var(--Grayscale-600, #606061)',
        'grayscale-900': 'var(--Grayscale-900, #141414)',
        'primary-300': 'var(--Primary-300, #B95FAB)'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
export default config;
