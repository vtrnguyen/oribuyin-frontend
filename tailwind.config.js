module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#38b6ff',
        'primary-dark': '#2093c7',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
