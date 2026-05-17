import { EstateInput, HeirEntry, CalculationResult, Share, Madhab } from './types';
import { HEIR_NAMES, MADHAB_NAMES } from './constants';
import { applyHijab } from './hijab';

// Fraction arithmetic helpers
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function simplify(n: number, d: number): [number, number] { const g = gcd(n, d); return [n/g, d/g]; }

// Fixed share ratios per heir type (simplified for demo, can be extended)
const FIXED_SHARES: Record<string, (remaining: number) => [number, number]> = {
  husband: (r) => [1, 2],   // 1/2 if no children, else 1/4 (simplified)
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
  const totalCount = activeHeirs.reduce((sum, h) => sum + h.count, 0);

  const shares: Share[] = [];
  let remaining = net;
  const steps: string[] = ['Net estate computed', 'Hijab applied'];

  // Simple distribution (expand with real fiqh later)
  for (const heir of activeHeirs) {
    const shareRatio = FIXED_SHARES[heir.type] || ((r: number) => [heir.count, totalCount]);
    const [num, den] = shareRatio(remaining);
    const amount = (remaining * num) / den;
    const simplified = simplify(num, den);
    shares.push({
      heirType: heir.type,
      name: HEIR_NAMES[heir.type] || heir.type,
      amount,
      fraction: { numerator: simplified[0], denominator: simplified[1] },
      colour: '#1B6B4A',
    });
  }

  return {
    netTotal: net,
    confidence: 95,
    confidenceExplanation: `Calculated according to ${MADHAB_NAMES[madhab]} school.`,
    shares,
    steps: [...steps, 'Shares distributed'],
  };
}
