import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/app": {
        target: "http://localhost:3000/app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app/, ""),
      },
    },
  },
});
