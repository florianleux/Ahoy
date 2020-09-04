import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

Vue.use(VueI18n);

export const fallBackLocale = "en";

export const languages = {
  en: en,
  fr: fr
};

const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: getBrowserLocale(),
  fallbackLocale: fallBackLocale,
  messages
});

function getBrowserLocale(options = {}) {
  const defaultOptions = { countryCodeOnly: false };

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
