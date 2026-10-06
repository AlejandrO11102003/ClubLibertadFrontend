/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#9B1B30", hover: "#6E1222" },
        accent: "#C9A227",
        main: "#F4F0EA",
        surface: "#FFFFFF",
        ink: { DEFAULT: "#1F1A17", muted: "#6B625B" },
        line: "#E5DFC8",
        success: "#2E7D4F",
        danger: "#B23A2E",
        cream: "#FAF6EF",
        sand: "#EFE9DC",
        blush: "#FDE8E8",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        sm2: "0 1px 3px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

