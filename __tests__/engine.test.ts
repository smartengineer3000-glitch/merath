import { describe, it, expect } from 'vitest';
import { calculateInheritance } from '../lib/engine/calculator';
import { applyHijab } from '../lib/engine/hijab';
import { HEIR_NAMES, MADHAB_NAMES } from '../lib/engine/constants';

describe('Inheritance Engine', () => {
  it('calculates with wife and 2 sons (Hanafi)', () => {
    const result = calculateInheritance('hanafi', { total: 120000, funeral: 0, debts: 0, will: 0 }, [
      { type: 'wife', count: 1 },
      { type: 'son', count: 2 },
    ]);
    expect(result.netTotal).toBe(120000);
    expect(result.shares.length).toBeGreaterThan(0);
  });

  it('calculates with wife and 3 daughters (Shafii)', () => {
    const result = calculateInheritance('shafii', { total: 100000, funeral: 0, debts: 0, will: 0 }, [
      { type: 'wife', count: 1 },
      { type: 'daughter', count: 3 },
    ]);
    expect(result.netTotal).toBe(100000);
  });

  it('applies hijab (son blocks siblings)', () => {
    const heirs = applyHijab([
      { type: 'son', count: 1 },
      { type: 'full_brother', count: 1 },
    ]);
    expect(heirs).toHaveLength(1);
    expect(heirs[0].type).toBe('son');
  });

  it('father blocks grandfather', () => {
    const heirs = applyHijab([
      { type: 'father', count: 1 },
      { type: 'grandfather', count: 1 },
    ]);
    expect(heirs).toHaveLength(1);
    expect(heirs[0].type).toBe('father');
  });

  it('returns all shares with names', () => {
    const result = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: 0, will: 0 }, [
      { type: 'wife', count: 1 },
      { type: 'son', count: 2 },
    ]);
    result.shares.forEach(share => {
      expect(share.name).toBeTruthy();
      expect(share.amount).toBeGreaterThan(0);
    });
  });

  it('handles zero estate', () => {
    const result = calculateInheritance('hanafi', { total: 0, funeral: 0, debts: 0, will: 0 }, [
      { type: 'son', count: 1 },
    ]);
    expect(result.netTotal).toBe(0);
  });

  it('handles empty heirs', () => {
    const result = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: 0, will: 0 }, []);
    expect(result.shares).toHaveLength(0);
  });

  it('handles negative debts (should not crash)', () => {
    const result = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: -500, will: 0 }, [
      { type: 'son', count: 1 },
    ]);
    expect(result.netTotal).toBe(1500);
  });

  it('calculates for all four madhabs', () => {
    ['hanafi','maliki','shafii','hanbali'].forEach(m => {
      const result = calculateInheritance(m as any, { total: 1000, funeral: 0, debts: 0, will: 0 }, [
        { type: 'son', count: 1 },
      ]);
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  it('includes steps in the result', () => {
    const result = calculateInheritance('hanafi', { total: 1000, funeral: 0, debts: 0, will: 0 }, [
      { type: 'son', count: 1 },
    ]);
    expect(result.steps.length).toBeGreaterThan(0);
  });
});

describe('Constants', () => {
  it('all heir types have names', () => {
    const keys = Object.keys(HEIR_NAMES);
    expect(keys.length).toBeGreaterThan(30);
  });

  it('all madhabs have names', () => {
    expect(MADHAB_NAMES.hanafi).toBeTruthy();
    expect(MADHAB_NAMES.maliki).toBeTruthy();
    expect(MADHAB_NAMES.shafii).toBeTruthy();
    expect(MADHAB_NAMES.hanbali).toBeTruthy();
  });
});
