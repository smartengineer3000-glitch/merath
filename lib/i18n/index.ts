import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en.json';
import ar from './locales/ar.json';

const i18n = new I18n({ en, ar });
i18n.locale = getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;

// Enable RTL if Arabic
if (i18n.locale === 'ar') {
  I18nManager.forceRTL(true);
}

export const t = (key: string) => i18n.t(key);
