import { HeirType, Madhab } from './types';

export class HijabSystem {
  private madhab: Madhab;

  constructor(madhab: Madhab) {
    this.madhab = madhab;
  }

  applyHijab(heirs: Record<string, number | undefined>): { heirs: Record<string, number | undefined> } {
    const result = { ...heirs };

    // Block siblings if there is a son
    if (heirs.son && heirs.son > 0) {
      result.full_brother = 0;
      result.full_sister = 0;
      result.half_brother_paternal = 0;
      result.half_sister_paternal = 0;
    }

    // Block paternal grandfather if father exists
    if (heirs.father && heirs.father > 0) {
      result.paternal_grandfather = 0;
      result.grandfather = 0;
    }

    return { heirs: result };
  }

  hasDescendants(heirs: Record<string, number>): boolean {
    return !!(heirs.son || heirs.daughter || heirs.grandson || heirs.granddaughter);
  }

  countMales(heirs: Record<string, number>): number {
    const maleHeirs = ['son', 'father', 'full_brother', 'half_brother_paternal', 'paternal_grandfather', 'grandfather', 'grandson'];
    return maleHeirs.reduce((sum, key) => sum + (heirs[key] || 0), 0);
  }

  countFemales(heirs: Record<string, number>): number {
    const femaleHeirs = ['daughter', 'mother', 'full_sister', 'half_sister_paternal', 'maternal_grandmother', 'granddaughter'];
    return femaleHeirs.reduce((sum, key) => sum + (heirs[key] || 0), 0);
  }

  checkInheritanceRights(heirType: string): boolean {
    const validTypes = [
      'husband', 'wife', 'son', 'daughter', 'father', 'mother',
      'full_brother', 'full_sister', 'paternal_grandfather', 'grandfather',
      'maternal_grandmother', 'grandson', 'granddaughter',
      'half_brother_paternal', 'half_sister_paternal'
    ];
    return validTypes.includes(heirType);
  }
}