import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same "@" alias as vue-cli, so test imports match the app's.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    // No Vue plugin: nothing here mounts a component, and @vitejs/plugin-vue2
    // is incompatible with the Vite version this project is heading towards.
    // jsdom is needed by anything touching Audio or localStorage.
    environment: "jsdom",
    include: ["tests/**/*.spec.js"],
    setupFiles: ["tests/setup.js"],
    // Spies are restored between tests, so specs only handle their own timers.
    restoreMocks: true,
    globals: true
  }
});
