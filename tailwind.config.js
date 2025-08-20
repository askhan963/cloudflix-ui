/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F172A", light: "#1E293B" }, // brand dark
        secondary: { DEFAULT: "#3B82F6", light: "#60A5FA" }, // blue accent
        neutral: { DEFAULT: "#F8FAFC", dark: "#E2E8F0" }, // background/surfaces
        accent: { DEFAULT: "#F59E0B", light: "#FBBF24" }, // CTA/highlights
      },
    },
  },
  plugins: [],
};
