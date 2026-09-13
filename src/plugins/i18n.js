import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

export const fallBackLocale = "en";

export const languages = {
  en: en,
  fr: fr
};

const messages = Object.assign(languages);

const STORAGE_KEY = "ahoyLocale";

// The stored choice wins over the browser. Reading localStorage can throw
// outright in Safari's private mode, so a failure here just means "nothing
// stored" rather than no game at all.
function storedLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored in languages ? stored : null;
  } catch {
    return null;
  }
}

function getBrowserLocale(options = {}) {
  // Country code only: "fr-FR" resolves to "fr" rather than missing the
  // messages and falling back to English.
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

const i18n = createI18n({
  // Composition mode. globalInjection keeps $t working in every template, so
  // the 31 keys and every call site stay exactly as they are.
  legacy: false,
  globalInjection: true,
  locale: storedLocale() || getBrowserLocale(),
  fallbackLocale: fallBackLocale,
  messages
});

// The only way the locale is written. Under legacy: false it is a ref, and the
// choice has to outlive the reload -- which it did not before: the browser was
// re-detected on every load and the settings window had no lasting effect.
export function setLocale(locale) {
  i18n.global.locale.value = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Private mode: the language still changes, it just will not be remembered.
  }
}

export function currentLocale() {
  return i18n.global.locale.value;
}

export default i18n;
