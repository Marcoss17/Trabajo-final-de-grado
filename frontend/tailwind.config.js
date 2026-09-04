/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./components/**/*.{vue,js}",
      "./layouts/**/*.{vue,js}",
      "./pages/**/*.{vue,js}",
      "./app.vue",
    ],
    theme: {
      extend: {
        colors: {
          negro: '#000000',
          dorado: '#FFD700',
          doradoOscuro: '#b8860b',
        },
      },
    },
    plugins: [],
  }
  