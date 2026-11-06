import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { navy: "#0b1f3f", gold: "#c9a24b", beige: "#f6f0e4" } } },
  plugins: [],
};
export default config;
