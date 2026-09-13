import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

export const fallBackLocale = "en";

export const languages = {
  en: en,
  fr: fr
};

const messages = Object.assign(languages);

const i18n = createI18n({
  // Legacy mode keeps $t and $i18n.locale working from the Options API.
  // Composition mode, and persisting the locale, are #57.
  legacy: true,
  globalInjection: true,
  locale: getBrowserLocale(),
  fallbackLocale: fallBackLocale,
  messages
});

function getBrowserLocale(options = {}) {
  const defaultOptions = { countryCodeOnly: true };

  const opt = { ...defaultOptions, ...options };

  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;

  if (!navigatorLocale) {
    return undefined;
  }

  const trimmedLocale = opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();

  return trimmedLocale;
}

export default i18n;
