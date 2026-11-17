// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         'inter': ['Inter', 'sans-serif'],
//         'lato': ['Lato', 'sans-serif'],
//         'nunito-sans': ['Nunito Sans', 'sans-serif'],
//         'open-sans': ['Open Sans', 'sans-serif'],
//         'roboto': ['Roboto', 'sans-serif'],
//       }
//     },
//   },
//   darkMode: 'class',
//   plugins: [require('daisyui')],
// }
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        "nunito-sans": ["Nunito Sans", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        red: {
          600: "#D32F2F", // Primary Red
        },
        gray: {
          900: "#121212", // Dark background for Dark Mode
          500: "#424242", // Secondary Gray for text and borders
          300: "#B0BEC5", // Lighter Gray for text in dark mode
        },
        white: "#FFFFFF", // White text in dark mode
        black: "#000000", // Default black text in light mode
        offwhite: "#F5F5F5", // Soft background color for light mode
      },
    },
  },
  darkMode: ["class"], // Enable both class-based and media-based dark modes
  plugins: [require("daisyui")], // Enables DaisyUI components for faster UI development
};
