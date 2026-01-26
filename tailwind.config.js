

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
   extend: {
 colors: {
      brand: "#4f46e5",    // indigo-600
      brandSoft: "#6366f1",// indigo-500
      bg: "#ffffff",
      bgSoft: "#f8fafc",   // slate-50
      text: "#0f172a",     // slate-900
      muted: "#64748b",    // slate-500
      borderSoft: "#e2e8f0"// slate-200
  },
},

  },
  plugins: [],
};
