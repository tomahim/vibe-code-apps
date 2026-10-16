import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Keep Host aligned with the browser's Origin for Django's admin CSRF checks.
const apiProxy = {
  target: process.env.API_DEV_URL || "http://localhost:8000",
  changeOrigin: false,
};

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(?:@codemirror|@lezer|style-mod|w3c-keyname)/.test(id)) return 'code-editor';
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": apiProxy,
      "/admin": apiProxy,
      "/static": apiProxy,
      "/health": apiProxy,
    },
  },
});
