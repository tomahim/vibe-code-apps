import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
      "/api": process.env.API_DEV_URL || "http://localhost:8000",
      "/admin": process.env.API_DEV_URL || "http://localhost:8000",
      "/static/admin": process.env.API_DEV_URL || "http://localhost:8000",
      "/health": process.env.API_DEV_URL || "http://localhost:8000",
    },
  },
});
