import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue2";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Same "@" alias as vue-cli, so test imports match the app's.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    // jsdom is needed by anything touching Audio, localStorage or the DOM.
    // The plain classes under src/classes/ don't need it, but one environment
    // for everything keeps this config to a single case.
    environment: "jsdom",
    include: ["tests/**/*.spec.js"],
    globals: true
  }
});
