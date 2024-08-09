/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        drive: {
          100: "#c5d2d9",
          200: "#9db6c4",
          300: "#91afbf",
          400: "#6d9bb5",
          500: "#327da8",
          600: "#2f6c8f",
          700: "#206b96",
          800: "#0d79b8",
          900: "#048bd9",
        },
      },
    },
  },
  plugins: [],
}
