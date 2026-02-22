/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // only if you have src/
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
