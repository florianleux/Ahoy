import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

// One config for the app and the tests: vitest reads vite.config, so the alias
// and the Vue plugin cannot drift apart between the two.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    // jsdom is needed by anything touching Audio or localStorage.
    environment: "jsdom",
    include: ["tests/**/*.spec.js"],
    setupFiles: ["tests/setup.js"],
    // Spies are restored between tests, so specs only handle their own timers.
    restoreMocks: true,
    globals: true
  }
});
