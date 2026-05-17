import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    welcome: 'Welcome',
    estate: 'Estate Details',
    total: 'Total Estate',
    funeral: 'Funeral Costs',
    debts: 'Debts',
    will: 'Will (optional)',
    next: 'Next: Select School',
    selectSchool: 'Select School',
    hanafi: 'Hanafi',
    maliki: 'Maliki',
    shafii: "Shafi'i",
    hanbali: 'Hanbali',
    addHeirs: 'Add Family Members',
    calculate: 'Calculate Inheritance',
    results: 'Results',
    netEstate: 'Net Estate',
    distribution: 'Distribution',
    compare: 'Compare Schools',
    history: 'History',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    about: 'About Merath',
    pdf: 'Export PDF',
    share: 'Share Link',
    copy: 'Copy Text',
    fractions: 'Fractions',
    percentages: 'Percentages',
  },
  ar: {
    welcome: 'أهلاً وسهلاً',
    estate: 'تفاصيل التركة',
    total: 'إجمالي التركة',
    funeral: 'مصاريف الجنازة',
    debts: 'الديون',
    will: 'الوصية (اختياري)',
    next: 'التالي: اختر المذهب',
    selectSchool: 'اختر المذهب',
    hanafi: 'حنفي',
    maliki: 'مالكي',
    shafii: 'شافعي',
    hanbali: 'حنبلي',
    addHeirs: 'أضف أفراد الأسرة',
    calculate: 'احسب الميراث',
    results: 'النتائج',
    netEstate: 'صافي التركة',
    distribution: 'التوزيع',
    compare: 'مقارنة المذاهب',
    history: 'السجل',
    settings: 'الإعدادات',
    darkMode: 'الوضع الداكن',
    about: 'عن مراث',
    pdf: 'تصدير PDF',
    share: 'مشاركة الرابط',
    copy: 'نسخ النص',
    fractions: 'كسور',
    percentages: 'نسب مئوية',
  },
};

const i18n = new I18n(translations);
i18n.locale = getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;

export const t = (key: string) => i18n.t(key);

// Enable RTL if Arabic
if (i18n.locale === 'ar') {
  I18nManager.forceRTL(true);
}
