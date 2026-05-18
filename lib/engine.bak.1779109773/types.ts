/**
 * نوع البيانات الأساسية لحاسبة المواريث الشرعية
 * Fundamental Data Types for Islamic Inheritance Calculator
 */

// ====== المذاهب الإسلامية ======
export type MadhhabType = "shafii" | "hanafi" | "maliki" | "hanbali";

// ====== أنواع الورثة ======
export type HeirType =
  | "husband"
  | "wife"
  | "son"
  | "daughter"
  | "grandson"
  | "granddaughter"
  | "daughter_son"
  | "daughter_daughter"
  | "sister_children"
  | "father"
  | "mother"
  | "grandfather"
  | "grandmother_mother"
  | "grandmother_father"
  | "full_brother"
  | "full_sister"
  | "paternal_brother"
  | "paternal_sister"
  | "maternal_brother"
  | "maternal_sister"
  | "full_nephew"
  | "paternal_nephew"
  | "full_uncle"
  | "paternal_uncle"
  | "maternal_uncle"
  | "paternal_aunt"
  | "maternal_aunt"
  | "full_cousin"
  | "paternal_cousin"
  | "treasury"
  | "shared_siblings";

// ====== بيانات التركة ======
export interface EstateData {
  total: number; // إجمالي التركة بالريال
  funeral: number; // تكاليف التجهيز والدفن
  funeralCosts?: number; // تكاليف التجهيز والدفن (alternative name)
  debts: number; // الديون المستحقة
  will: number; // الوصية (تُحسب بثلث الباقي عادة)
  willAmount?: number; // الوصية (alternative name)
}

// ====== بيانات الورثة ======
export interface HeirsData {
  [key: string]: number | undefined;
}

// ====== نظام الكسور ======
export interface FractionData {
  numerator: number; // البسط
  denominator: number; // المقام
}

// ====== حصة الوارث (Enhanced) ======
export interface HeirShare {
  heir?: string;
  key?: HeirType;
  name: string;
  count?: number;
  fraction?: FractionData;
  share?: number;
  percentage?: number;
  amount: number;
  shareType?: string;
  madhab?: MadhhabType;
  type?: string;
  shares?: {
    person: number;
    amount: number;
  }[];
}

// ====== الحالات الخاصة ======
export interface SpecialCases {
  awl: boolean;
  auled: number;
  radd: boolean;
  hijabTypes: string[];
}

// ====== نتيجة الحساب (Enhanced) ======
export interface CalculationResult {
  success: boolean;
  madhab: MadhhabType;
  madhhabName: string;
  shares: HeirShare[];
  netEstate?: number;
  finalBase?: number;
  blockedHeirs?: string[];
  awlApplied?: boolean;
  raddApplied?: boolean;
  bloodRelativesApplied?: boolean;
  confidence: number;
  confidenceFactors?: string[];
  steps: CalculationStep[];
  calculationTime: number;
  error?: string;
  specialCases?: SpecialCases;
  madhhabNotes?: string[];
  warnings?: string[];
}

// ====== خطوات الحساب ======
export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}

// ====== معلومات المذهب ======
export interface MadhhabConfig {
  code: MadhhabType;
  name: string;
  description: string;
  color: string;
  icon: string;
  rules: MadhhabRules;
}

// ====== قواعد المذهب ======
export interface MadhhabRules {
  grandfather_with_siblings: "hijab" | "musharak";
  mother_with_father_children: "third_of_remainder" | "sixth";
  mother_with_father_only: "third" | "sixth";
  spouse_radd: boolean;
  umariyyah_rule: "first" | "second";
}

// ====== حالات الاختبار ======
export interface TestCase {
  name: string;
  heirs: HeirsData;
  expected: Record<string, number>;
  tolerance?: number;
  madhab?: MadhhabType;
  description: string;
}

// ====== نتائج الاختبار ======
export interface TestResult {
  name: string;
  madhab: MadhhabType;
  passed: boolean;
  skipped: boolean;
  error?: string;
  discrepancies?: string[];
  testTime: number;
}

// ====== إدخالات السجل ======
export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  type: "success" | "error" | "warning" | "info" | "calculation";
  message: string;
  details?: Record<string, any>;
  component?: string;
}
export type Madhab = "hanafi" | "maliki" | "shafii" | "hanbali";
