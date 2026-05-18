import { EnhancedInheritanceCalculationEngine } from '../engine/calculator';
import { EstateInput, HeirEntry, HeirsData } from '../engine/types';

export function calculateInheritance(input: any) {
  const estate: EstateInput = {
    total: input.totalEstate || input.total || 0,
    funeral: input.funeralExpenses || input.funeral || 0,
    debts: input.debts || 0,
    will: input.will || input.willAmount || 0,
  };
  const heirs: HeirEntry[] = input.heirs || [];
  const heirsRecord: HeirsData = {};
  heirs.forEach((h: HeirEntry) => { if (h.count > 0) heirsRecord[h.type] = h.count; });
  const engine = new EnhancedInheritanceCalculationEngine(
    input.madhab || input.madhab || 'hanafi',
    estate,
    heirsRecord
  );
  return engine.calculate();
}
