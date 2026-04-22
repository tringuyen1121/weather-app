import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Set VITE_BASE_PATH env var for GitHub Pages deploys (e.g. /weather-display/)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? "/",
});
