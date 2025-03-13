import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // Need this for twitch to load assets correctly from relative paths
  server: {
    port: 8080,
    https: {
      cert: './cert.pem',
      key: './key.pem'
    }
  },
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        panel: resolve(__dirname, "panel.html"),
        mobile: resolve(__dirname, "mobile.html"),
        config: resolve(__dirname, "config.html"),
        live_config: resolve(__dirname, "live_config.html"),
      },
    },
  },
});
