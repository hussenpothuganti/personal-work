/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jarvis-blue': '#00d4ff',
        'jarvis-cyan': '#00ffff',
        'jarvis-green': '#00ff88',
        'jarvis-dark': '#0a0a0a',
        'jarvis-gray': '#1a1a1a',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'audiowide': ['Audiowide', 'cursive'],
        'share-tech': ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ffff' },
          '50%': { boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

