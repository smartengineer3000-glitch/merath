import { HeirType, HeirEntry } from './types';

export function applyHijab(heirs: HeirEntry[]): HeirEntry[] {
  const present = new Set(heirs.map(h => h.type));
  if (present.has('son')) {
    return heirs.filter(h => !['full_brother','full_sister','paternal_brother','paternal_sister'].includes(h.type));
  }
  if (present.has('father')) {
    return heirs.filter(h => h.type !== 'grandfather');
  }
  return heirs;
}

export class HijabSystem {
  private madhab: string;
  constructor(madhab: string) { this.madhab = madhab; }
  applyHijab(heirs: Record<string, number | undefined>): { heirs: Record<string, number | undefined> } {
    const result = { ...heirs };
    if (heirs.son && heirs.son > 0) {
      result.full_brother = 0; result.full_sister = 0;
      result.paternal_brother = 0; result.paternal_sister = 0;
    }
    if (heirs.father && heirs.father > 0) {
      result.grandfather = 0;
    }
    return { heirs: result };
  }
}
