/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include Expo Router screens so NativeWind can see className usage.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
