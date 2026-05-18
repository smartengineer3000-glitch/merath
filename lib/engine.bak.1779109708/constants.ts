import { HeirType, Madhab } from './types';

export const HEIR_NAMES: Record<HeirType, string> = {
  husband: 'الزوج', wife: 'الزوجة',
  father: 'الأب', mother: 'الأم',
  grandfather: 'الجد',
  grandmother_mother: 'الجدة لأم', grandmother_father: 'الجدة لأب',
  son: 'الابن', daughter: 'البنت',
  grandson: 'ابن الابن', granddaughter: 'بنت الابن',
  daughter_son: 'ابن البنت', daughter_daughter: 'بنت البنت',
  full_brother: 'الأخ الشقيق', full_sister: 'الأخت الشقيقة',
  paternal_brother: 'الأخ لأب', paternal_sister: 'الأخت لأب',
  maternal_brother: 'الأخ لأم', maternal_sister: 'الأخت لأم',
  full_nephew: 'ابن الأخ الشقيق', paternal_nephew: 'ابن الأخ لأب',
  sister_children: 'أولاد الأخت',
  full_uncle: 'العم الشقيق', paternal_uncle: 'العم لأب',
  maternal_uncle: 'الخال', maternal_aunt: 'الخالة', paternal_aunt: 'العمة',
  full_cousin: 'ابن العم الشقيق', paternal_cousin: 'ابن العم لأب',
  treasury: 'بيت المال', shared_siblings: 'الإخوة لأم والأشقاء',
};

export const MADHAB_COLORS: Record<Madhab, string> = {
  hanafi: '#4ECDC4', maliki: '#45B7D1', shafii: '#FF6B6B', hanbali: '#F7DC6F',
};

export const MADHAB_NAMES: Record<Madhab, string> = {
  hanafi: 'الحنفي', maliki: 'المالكي', shafii: 'الشافعي', hanbali: 'الحنبلي',
};
