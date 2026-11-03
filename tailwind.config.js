/** @type {import('tailwindcss').Config} */
// Ranglar va shriftlar muhaddis.uz (Hadis ilmi maktabi) saytining dizayn tizimidan olingan:
// oltin rang palitrasi (E8AF4D, CA923D), sarlavhalar uchun Poppins, matn uchun Alegreya.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#E8AF4D", // asosiy oltin (tugmalar, nishonlar)
          deep: "#CA923D", // hover va chiziqlar
          soft: "#FBF1DC", // ochiq fon
          text: "#8A5A0F", // oq fonda o'qiladigan oltin matn (kontrast 5:1+)
        },
        ink: "#1f1f1f", // asosiy matn
        mute: "#6b6b6b", // ikkinchi darajali matn
        line: "#e6e3dc", // ramka va ajratgich chiziqlar
        paper: "#faf9f6", // sahifa foni
      },
      fontFamily: {
        sans: ['"Poppins"', "system-ui", "sans-serif"],
        serif: ['"Alegreya"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(60, 45, 10, 0.05), 0 4px 14px rgba(60, 45, 10, 0.06)",
        lift: "0 8px 24px rgba(60, 45, 10, 0.12)",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { "fade-in": "fadeIn 0.25s ease-out" },
    },
  },
  plugins: [],
};
