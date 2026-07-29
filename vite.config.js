import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Set base path for GitHub Pages deployment
// For GitHub Pages, the base should be /<repository-name>/
// For other deployments (Vercel, local dev), use /
const base = process.env.GITHUB_PAGES ? "/devlink-frontend/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://devlink-31v3.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
