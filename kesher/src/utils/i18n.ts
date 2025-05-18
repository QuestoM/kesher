import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Translation files
import en from '../assets/locales/en.json';
import he from '../assets/locales/he.json';

// Create i18n instance
const i18n = new I18n({
  en,
  he,
});

// Set the locale
export function setupI18n() {
  // Set the locale based on device settings, defaulting to Hebrew
  const deviceLocale = Localization.locale.split('-')[0];
  i18n.locale = deviceLocale === 'he' || deviceLocale === 'iw' ? 'he' : 'he'; // Default to Hebrew
  i18n.enableFallback = true;
  i18n.defaultLocale = 'he';
}

export function setLocale(locale: string) {
  i18n.locale = locale;
}

export function translate(key: string, options = {}) {
  return i18n.t(key, options);
}

export const t = translate;

export default i18n; 