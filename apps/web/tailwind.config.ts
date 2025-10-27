import type { Config } from 'tailwindcss';
import sharedPreset from '../../packages/ui/tailwind-preset.cjs';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), ...sharedPreset.plugins],
};

export default config;
