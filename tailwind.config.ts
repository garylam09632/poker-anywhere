import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/type/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        '36': '9rem',
        '64': '16rem',
      },
      height: {
        '36': '9rem',
        '64': '16rem',
      },
      inset: {
        "1/5": '20%'
      },
      borderRadius: {
        'medium': '193px',
      },
      colors: {
        'grey': '#101010',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      translate: {
        '3/1': '300%',
        '2/1': '200%',
        '3/2': '150%',
        '4/3': '133.333333%',
        '5/4': '125%',
        '6/5': '120%',
        '7/6': '116.666667%',
        '8/7': '114.285714%',
        '9/8': '112.5%',
        '10/9': '111.111111%',
      },
      scale: {
        '85': '0.85',
        '90': '0.90',
        '120': '1.20',
        '125': '1.25',
        '150': '1.50',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: '0.5' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        },
        fadeOut: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        },
        'message-slide-down': {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1' 
          },
        }
      },
      animation: {
        'float-in': 'floatIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-out': 'fadeOut 0.3s ease-out forwards',
        'shake': 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
        'message-slide-down': 'messageSlideDown 0.3s ease-out forwards',
      },
      fontSize: {
        'xxs': '0.5rem',
        'xs': '0.625rem',
        'msm': '1rem',
      },
    },
    screens: {
      // Mobile
      'xxs': { 'raw': '(max-width: 480px)' },
      'xs': '480px',
      'sm': '640px',
      // Tablet
      'md': '768px',
      // Desktop
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
