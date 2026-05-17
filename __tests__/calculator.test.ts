import { describe, it, expect } from 'vitest';
import { calculateInheritance } from '../lib/engine/calculator';

describe('Full Calculator', () => {
  it('handles simple case', () => {
    const res = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: 0, will: 0 }, [{ type: 'son', count: 2 }]);
    expect(res.netTotal).toBe(1000);
    expect(res.shares.length).toBe(1);
  });

  it('applies hijab (son blocks siblings)', () => {
    const res = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: 0, will: 0 }, [
      { type: 'son', count: 1 },
      { type: 'full_brother', count: 1 }
    ]);
    // full_brother should be blocked
    expect(res.shares.find(s => s.heirType === 'full_brother')).toBeUndefined();
  });
});
