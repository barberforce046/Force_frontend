import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  },
  preview: { port: 5173 },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } }
});