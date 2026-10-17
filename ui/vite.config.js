import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { BRAND_NAME } from "./src/config/brand.js";

// Inject the shared brand name into index.html so the browser tab title
// comes from the same source as the UI (src/config/brand.js).
const brandHtml = () => ({
  name: "brand-html",
  transformIndexHtml(html) {
    return html.replace(/%BRAND_NAME%/g, BRAND_NAME);
  },
});

// Keep Host aligned with the browser's Origin for Django's admin CSRF checks.
const apiProxy = {
  target: process.env.API_DEV_URL || "http://localhost:8000",
  changeOrigin: false,
};

export default defineConfig({
  plugins: [react(), brandHtml()],
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
