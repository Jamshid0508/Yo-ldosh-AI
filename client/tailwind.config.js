/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sign-blue": "var(--sign-blue)",
        "blue-deep": "var(--blue-deep)",
        marking: "var(--marking)",
        asphalt: "var(--asphalt)",
        concrete: "var(--concrete)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      fontFamily: {
        heading: ["Overpass", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Overpass Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      boxShadow: {
        "btn-3d": "0 4px 0 var(--blue-deep)",
        "btn-3d-danger": "0 4px 0 #8a251d",
        "btn-3d-success": "0 4px 0 #145c34",
      },
      keyframes: {
        "flame-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
      },
      animation: {
        "flame-pulse": "flame-pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
