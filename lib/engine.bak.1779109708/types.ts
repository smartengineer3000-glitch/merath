export type Madhab = 'hanafi' | 'maliki' | 'shafii' | 'hanbali';

export type HeirType =
  | 'husband' | 'wife' | 'son' | 'daughter' | 'grandson' | 'granddaughter'
  | 'daughter_son' | 'daughter_daughter' | 'sister_children'
  | 'father' | 'mother' | 'grandfather' | 'grandmother_mother' | 'grandmother_father'
  | 'full_brother' | 'full_sister' | 'paternal_brother' | 'paternal_sister'
  | 'maternal_brother' | 'maternal_sister' | 'full_nephew' | 'paternal_nephew'
  | 'full_uncle' | 'paternal_uncle' | 'maternal_uncle' | 'paternal_aunt' | 'maternal_aunt'
  | 'full_cousin' | 'paternal_cousin' | 'treasury' | 'shared_siblings';

export interface EstateInput { total: number; funeral: number; debts: number; will: number; }
export interface HeirEntry { type: HeirType; count: number; }
export interface Fraction { numerator: number; denominator: number; }
export interface Share {
  heirType: HeirType;
  name: string;
  amount: number;
  fraction: Fraction;
  colour: string;
}
export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  action: string;
  details: Record<string, any>;
}
export interface CalculationResult {
  netTotal: number;
  confidence: number;
  confidenceExplanation: string;
  shares: Share[];
  steps: CalculationStep[];
  awlApplied?: boolean;
  raddApplied?: boolean;
  specialNotes?: string[];
}
