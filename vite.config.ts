import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        halo: "halo.html",
        maxReed: "max-reed.html",
        maxReedV2: "max-reed-v2.html",
      },
    },
  },
});
