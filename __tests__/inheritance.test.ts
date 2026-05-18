/**
 * اختبارات الوحدة الأساسية
 * Basic Unit Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { FractionClass } from "../lib/engine/fraction";
import { HijabSystem } from "../lib/engine/hijab";
import {
  validateEstateData,
  validateHeirsData,
  countTotalHeirs,
} from "../lib/engine/constants";

describe("FractionClass", () => {
  let half: FractionClass;
  let third: FractionClass;
  let quarter: FractionClass;

  beforeEach(() => {
    half = new FractionClass(1, 2);
    third = new FractionClass(1, 3);
    quarter = new FractionClass(1, 4);
  });

  it("should simplify fractions", () => {
    const fraction = new FractionClass(2, 4);
    expect(fraction.numeratorValue).toBe(1);
    expect(fraction.denominatorValue).toBe(2);
  });

  it("should convert to decimal correctly", () => {
    expect(half.toDecimal()).toBeCloseTo(0.5);
    expect(third.toDecimal()).toBeCloseTo(0.333, 2);
    expect(quarter.toDecimal()).toBeCloseTo(0.25);
  });

  it("should add fractions", () => {
    const result = half.add(quarter);
    expect(result.toDecimal()).toBeCloseTo(0.75);
  });

  it("should subtract fractions", () => {
    const result = half.subtract(quarter);
    expect(result.toDecimal()).toBeCloseTo(0.25);
  });

  it("should multiply fractions", () => {
    const result = half.multiply(2);
    expect(result.toDecimal()).toBeCloseTo(1.0);
  });

  it("should divide fractions", () => {
    const result = half.divide(2);
    expect(result.toDecimal()).toBeCloseTo(0.25);
  });

  it("should handle Arabic names", () => {
    expect(half.toArabicName()).toBe("النصف");
    expect(third.toArabicName()).toBe("الثلث");
    expect(quarter.toArabicName()).toBe("الربع");
  });

  it("should throw on division by zero", () => {
    expect(() => {
      half.divide(0);
    }).toThrow();
  });

  it("should check equality with tolerance", () => {
    const similar = new FractionClass(999, 2000); // قريب جداً من 0.5
    expect(half.equals(similar)).toBe(true);
  });
});

describe("HijabSystem", () => {
  let hijabSystem: HijabSystem;

  beforeEach(() => {
    hijabSystem = new HijabSystem("shafii");
  });

  it("should block siblings when son exists", () => {
    const heirs = {
      son: 1,
      full_brother: 2,
      full_sister: 1,
    };

    const { heirs: result } = hijabSystem.applyHijab(heirs);

    expect(result.son).toBe(1);
    expect(result.full_brother).toBe(0); // محجوب
    expect(result.full_sister).toBe(0); // محجوب
  });

  it("should block grandfather when father exists (Shafi'i)", () => {
    const hijabSystemShafii = new HijabSystem("shafii");
    const heirs = {
      father: 1,
      grandfather: 1,
    };

    const { heirs: result } = hijabSystemShafii.applyHijab(heirs);

    expect(result.father).toBe(1);
    expect(result.grandfather).toBe(0); // محجوب
  });

  it("should detect descendants", () => {
    const withChildren = { son: 1, daughter: 2 };
    const withoutChildren = { father: 1, mother: 1 };

    expect(hijabSystem.hasDescendants(withChildren)).toBe(true);
    expect(hijabSystem.hasDescendants(withoutChildren)).toBe(false);
  });

  it("should count males and females", () => {
    const heirs = {
      husband: 1,
      wife: 1,
      son: 2,
      daughter: 1,
    };

    expect(hijabSystem.countMales(heirs)).toBe(2); // son + son فقط (بدون الزوج)
    expect(hijabSystem.countFemales(heirs)).toBe(1); // daughter فقط (بدون الزوجة)
  });

  it("should verify inheritance rights", () => {
    expect(hijabSystem.checkInheritanceRights("husband")).toBe(true);
    expect(hijabSystem.checkInheritanceRights("son")).toBe(true);
    expect(hijabSystem.checkInheritanceRights("invalid_heir")).toBe(false);
  });
});

describe("Validation Functions", () => {
  it("should validate estate data", () => {
    const valid = validateEstateData(100000, 5000, 10000);
    expect(valid).toBeNull();

    const invalidTotal = validateEstateData(0, 5000, 10000);
    expect(invalidTotal).not.toBeNull();

    const exceedingCosts = validateEstateData(100000, 50000, 60000);
    expect(exceedingCosts).not.toBeNull();
  });

  it("should validate heirs data", () => {
    const validHeirs = { husband: 1, daughter: 1 };
    expect(validateHeirsData(validHeirs)).toBeNull();

    const emptyHeirs = {};
    expect(validateHeirsData(emptyHeirs)).not.toBeNull();

    const invalidHeirType = { invalid_heir: 1 };
    expect(validateHeirsData(invalidHeirType)).not.toBeNull();

    const negativeCount = { husband: -1 };
    expect(validateHeirsData(negativeCount)).not.toBeNull();
  });

  it("should count total and types of heirs", () => {
    const heirs = {
      husband: 1,
      daughter: 2,
      father: 1,
    };

    expect(countTotalHeirs(heirs)).toBe(4);
  });
});

describe("Integration Tests", () => {
  it("should handle basic case: husband + daughter", () => {
    const hijab = new HijabSystem("shafii");
    const heirs = { husband: 1, daughter: 1 };

    const { heirs: result } = hijab.applyHijab(heirs);

    expect(result.husband).toBe(1);
    expect(result.daughter).toBe(1);

    // النتائج المتوقعة:
    // الزوج: 1/2
    // البنت: 1/2
  });

  it("should handle complex case with hijab", () => {
    const hijab = new HijabSystem("shafii");
    const heirs = {
      son: 1,
      father: 1,
      full_brother: 2,
      mother: 1,
    };

    const { heirs: result } = hijab.applyHijab(heirs);

    expect(result.son).toBe(1);
    expect(result.father).toBe(1);
    expect(result.full_brother).toBe(0); // محجوب من الابن
    expect(result.mother).toBe(1);
  });
});
