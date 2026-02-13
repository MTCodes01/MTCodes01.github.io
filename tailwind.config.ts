import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.3)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "boot-fade": "bootFade 0.8s ease-in-out",
        "dock-bounce": "dockBounce 0.3s ease-in-out",
        "window-open": "windowOpen 0.2s ease-out",
        "window-close": "windowClose 0.15s ease-in",
      },
      keyframes: {
        bootFade: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        dockBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        windowOpen: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        windowClose: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
