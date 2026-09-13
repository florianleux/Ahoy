import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

// Flat config. Prettier owns formatting -- skipFormatting turns off every rule
// that would argue with it -- so what is left here is about meaning.
export default defineConfigWithVueTs(
  {
    name: "ahoy/files",
    files: ["**/*.{js,ts,vue}"]
  },
  {
    name: "ahoy/ignores",
    ignores: ["dist/**", "coverage/**", "node_modules/**"]
  },

  js.configs.recommended,
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: "ahoy/rules",
    rules: {
      // The typecheck already refuses an unused local; this would only repeat it.
      "@typescript-eslint/no-unused-vars": "off",
      // What the project has decided it does not write.
      "@typescript-eslint/no-explicit-any": "error",
      "vue/multi-word-component-names": "off"
    }
  },

  {
    // The enemy sheet renders its power descriptions with v-html, because the
    // text in the message catalogue carries its own line breaks. The catalogue
    // is static and ours -- no player input reaches it -- so the XSS the rule
    // guards against has nowhere to come from.
    name: "ahoy/enemy-sheet",
    files: ["src/components/PreFight/CurrentEnemy.vue"],
    rules: {
      "vue/no-v-html": "off"
    }
  },

  {
    // The specs are plain JavaScript and run under Vitest globals.
    name: "ahoy/tests",
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        localStorage: "readonly",
        HTMLMediaElement: "readonly"
      }
    }
  },

  {
    name: "ahoy/browser",
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        confirm: "readonly",
        alert: "readonly",
        Audio: "readonly",
        Event: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLDialogElement: "readonly",
        HTMLAudioElement: "readonly",
        MouseEvent: "readonly",
        Element: "readonly",
        Document: "readonly"
      }
    }
  }
);
