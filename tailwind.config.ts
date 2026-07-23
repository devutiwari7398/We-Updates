import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { ink: '#0f172a', brand: '#2563EB', sky: '#0EA5E9' },
   boxShadow: { soft: '0 10px 30px rgba(15,23,42,.08)' } } },
  plugins: []
};

export default config;
