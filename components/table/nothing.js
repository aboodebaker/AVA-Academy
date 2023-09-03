/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', 
    theme: {
      extend: {
        colors: {
          'foreground-rgb': "var(--foreground-rgb)",
          'background-start-rgb': "var(--background-start-rgb)",
          'background-end-rgb': "var(--background-end-rgb)",
          'text': "var(--text)",
          'background': "var(--background)",
          'primary': "var(--primary)",
          'secondary': "var(--secondary)",
          'accent': "var(--accent)",
          'backgroundAccent': 'rgba(255, 255, 255, 0.04)'
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
      },
    },
    plugins: [],
  }
  