import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(dirname, "index.html"),
        favoritos: resolve(__dirname, "detalles/detalles.html"),
      },
    },
  },
});
