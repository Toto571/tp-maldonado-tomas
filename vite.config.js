import { resolve, dirname as pathDirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = pathDirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        detalles: resolve(__dirname, "detalles/detalles.html"),
      },
    },
  },
});
