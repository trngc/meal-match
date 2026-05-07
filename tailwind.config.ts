import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF4E8",
        surface: "#FFFCF7",
        coral: "#E8825F",
        sage: "#7FB069",
        peach: "#F5A593",
        cocoa: "#3D2E2A",
        mustard: "#F4C95D",
        "cocoa-soft": "rgba(61, 46, 42, 0.6)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      borderRadius: {
        card: "24px",
        pill: "999px",
      },
      boxShadow: {
        warm: "0 8px 24px rgba(232, 130, 95, 0.15)",
        "warm-sm": "0 4px 14px rgba(232, 130, 95, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
