module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mspGreen: "#185959",
      },
      fontFamily: {
        workSans: ['WorkSans', 'sans-serif'],
      },
      fontFamily: {
        merriWeather: ['MerriWeather', 'sans-serif'],
      },
    }
  },
  plugins: []
}
