import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'grey': '#101010',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      scale: {
        '85': '0.85',
        '90': '0.90'
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-in': 'floatIn 0.5s ease-out',
      },
    },
    screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // 'sm': { 'raw': '(max-width: 640px)' },
        // 'md': { 'raw': '(max-width: 768px)' },
        // 'lg': { 'raw': '(max-width: 1024px)' },
        // 'xl': { 'raw': '(max-width: 1280px)' },
        // '2xl': { 'raw': '(max-width: 1536px)' },
        'sh': { 'raw': '(max-height: 480px)' },
        'mh': { 'raw': '(max-height: 640px)' },
      },
  },
  plugins: [],
};
export default config;
