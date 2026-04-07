import { Config } from 'tailwindcss';

export const tailwindcssConfig: Config = {
  content: ['./src/**/*.{tsx,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        heartbeat: 'heartbeat 2s infinite',
      },
    },
    keyframes: {
      heartbeat: {
        '0%, 80%': {
          transform: 'scale(1)',
        },
        '90%': {
          transform: 'scale(1.20)',
        },
      },
    },
  },
  plugins: [],
};
