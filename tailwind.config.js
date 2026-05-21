module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#050505',
          800: '#0f0f13',
          700: '#1a1a24',
        },
        neon: {
          cyan: '#00f0ff',
          purple: '#bf00ff',
          pink: '#ff007f',
        }
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(191, 0, 255, 0.5), 0 0 20px rgba(191, 0, 255, 0.3)',
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top right, #1a1a24, #050505)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}