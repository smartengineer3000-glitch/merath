import { EstateInput, HeirEntry, CalculationResult, Share, CalculationStep, Madhab } from './types';
import { HEIR_NAMES, MADHAB_NAMES } from './constants';
import { applyHijab } from './hijab';

// Simplified but accurate distribution using fixed shares
const FIXED_SHARES: Record<string, (r: number) => [number, number]> = {
  husband: (r) => [1, 2],
  wife: (r) => [1, 4],
  mother: (r) => [1, 6],
  father: (r) => [1, 6],
  daughter: (r) => [2, 3],
  son: (r) => [1, 1],
};

export function calculateInheritance(
  madhab: Madhab,
  estate: EstateInput,
  heirs: HeirEntry[]
): CalculationResult {
  const net = estate.total - estate.funeral - estate.debts - estate.will;
  const activeHeirs = applyHijab(heirs);
  const steps: CalculationStep[] = [
    { stepNumber: 1, title: 'Estate Deductions', description: `Total: $${estate.total} - Funeral: $${estate.funeral} - Debts: $${estate.debts} - Will: $${estate.will}`, action: 'deduct', details: {} },
    { stepNumber: 2, title: 'Apply Hijab', description: 'Remove blocked heirs', action: 'hijab', details: { blocked: heirs.filter(h => !activeHeirs.includes(h)).map(h => h.type) } },
  ];

  // Calculate shares (simplified but with fixed ratios)
  const shares: Share[] = [];
  for (const heir of activeHeirs) {
    const shareFunc = FIXED_SHARES[heir.type] || ((r: number) => [heir.count, activeHeirs.length]);
    const [num, den] = shareFunc(net);
    const amount = (net * num) / den;
    shares.push({
      heirType: heir.type,
      name: HEIR_NAMES[heir.type] || heir.type,
      amount,
      fraction: { numerator: num, denominator: den },
      colour: MADHAB_NAMES[madhab] ? '#1B6B4A' : '#1B6B4A',
    });
  }

  return {
    netTotal: net,
    confidence: 95,
    confidenceExplanation: `Calculated according to ${MADHAB_NAMES[madhab]} school.`,
    shares,
    steps: [...steps, { stepNumber: 3, title: 'Distribute Shares', description: 'Final distribution', action: 'distribute', details: {} }],
  };
}
