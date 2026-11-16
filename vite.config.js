import { defineConfig } from "vite";
import { resolve } from "node:path";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
export default defineConfig({
  base:
    process.env.BASE_PATH ||
    (repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/"),
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        ["index", "explore", "city", "about"].map((name) => [
          name,
          resolve(import.meta.dirname, `${name}.html`),
        ]),
      ),
    },
  },
});
