import { EnhancedInheritanceCalculationEngine } from '../engine/calculator';
import { EstateInput, HeirEntry } from '../engine/types';

export function calculateInheritance(input: any) {
  const estate: EstateInput = {
    total: input.totalEstate || input.total || 0,
    funeral: input.funeralExpenses || input.funeral || 0,
    debts: input.debts || 0,
    will: input.will || input.willAmount || 0,
  };
  const heirs: HeirEntry[] = input.heirs || [];
  const engine = new EnhancedInheritanceCalculationEngine(
    input.madhab || input.madhab || 'hanafi',
    estate,
    heirs
  );
  return engine.calculate();
}
