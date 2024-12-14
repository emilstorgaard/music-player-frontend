/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'black': '#000',
        'white': "#fff",
        'green': '#1ed760',
        'light-green': '#3df274',
        'dark-gray': '#1f1f1f',
        'light-gray': '#A19C9C',
        'gray': '#2A2A2A',
      },
    },
  },
  plugins: [],
}

