import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          canvas: "#0d1117",
          "canvas-subtle": "#161b22",
          "canvas-inset": "#010409",
          border: "#30363d",
          fg: "#e6edf3",
          "fg-muted": "#848d97",
          accent: "#58a6ff",
          "accent-emphasis": "#1f6feb",
          success: "#3fb950",
          danger: "#f85149",
          warning: "#d29922",
          done: "#a371f7",
          "btn-bg": "#21262d",
          "btn-hover": "#30363d",
          "btn-primary": "#238636",
          "btn-primary-hover": "#2ea043",
          "diff-add": "#0d4429",
          "diff-del": "#67060c",
          "diff-add-line": "#1a4721",
          "diff-del-line": "#5d0f12",
          "diff-add-bg": "rgba(46, 160, 67, 0.15)",
          "diff-del-bg": "rgba(248, 81, 73, 0.15)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
