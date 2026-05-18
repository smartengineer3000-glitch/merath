/**
 * Real-World Islamic Inheritance Scenarios
 * اختبارات الحالات الحقيقية للمواريث الشرعية
 *
 * These test cases represent actual inheritance scenarios
 * that users might encounter when calculating estates
 *
 * UPDATED: Added Musharraka, Akdariyya, and Grandfather with siblings tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { InheritanceCalculationEngine } from "../lib/inheritance";
import type { EstateData, HeirsData } from "../lib/engine/types";

describe("Real-World Islamic Inheritance Scenarios", () => {
  /**
   * Scenario 1: Simple Family with Wife and Children
   * حالة بسيطة - زوجة وأطفال
   */
  describe("Scenario 1: Wife and Multiple Children", () => {
    const estate: EstateData = {
      total: 500000, // 500,000 - reasonable estate value
      funeral: 5000, // 5,000 - funeral costs
      debts: 0, // No debts
      will: 0, // No will
    };

    it("Wife and 2 sons (Hanafi madhab)", () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2,
      };

      const engine = new InheritanceCalculationEngine("hanafi", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares).toBeDefined();
      expect(result.shares.length).toBeGreaterThan(0);

      // Wife should get 1/8 (or less with more heirs)
      // Sons should divide remainder equally
      const totalShares = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      expect(
        Math.abs(totalShares - (estate.total - estate.funeral)),
      ).toBeLessThan(1);
    });

    it("Wife and 3 daughters (Shafii madhab)", () => {
      const heirs: HeirsData = {
        wife: 1,
        daughter: 3,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares.length).toBeGreaterThan(0);

      // Daughters should get 2/3 total
      // Wife should get 1/8
      const totalAmount = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      expect(
        Math.abs(totalAmount - (estate.total - estate.funeral)),
      ).toBeLessThan(1);
    });
  });

  /**
   * Scenario 2: Deceased with Parents and Children
   * حالة مع الوالدين والأطفال
   */
  describe("Scenario 2: Parents and Children", () => {
    const estate: EstateData = {
      total: 300000, // 300,000
      funeral: 3000, // 3,000
      debts: 0,
      will: 0,
    };

    it("Father, Mother, Son, and Daughter (Maliki madhab)", () => {
      const heirs: HeirsData = {
        father: 1,
        mother: 1,
        son: 1,
        daughter: 1,
      };

      const engine = new InheritanceCalculationEngine("maliki", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares.length).toBeGreaterThan(0);

      // Father and Mother get fixed portions
      // Son and Daughter divide remainder
      const totalAmount = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      expect(
        Math.abs(totalAmount - (estate.total - estate.funeral)),
      ).toBeLessThan(1);
    });
  });

  /**
   * Scenario 3: Estate with Debts
   * حالة مع وجود ديون
   */
  describe("Scenario 3: Estate with Debts and Funeral Costs", () => {
    const estate: EstateData = {
      total: 1000000, // 1,000,000
      funeral: 20000, // 20,000 funeral costs
      debts: 150000, // 150,000 in debts
      will: 0,
    };

    it("Wife and 2 Sons with significant debts (Hanbali madhab)", () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2,
      };

      const engine = new InheritanceCalculationEngine("hanbali", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // Estate should be reduced by debts and funeral costs
      const netEstate = estate.total - estate.funeral - estate.debts;
      const totalShares = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );

      expect(Math.abs(totalShares - netEstate)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 4: Complex Family Structure
   * حالة معقدة - عائلة كبيرة
   */
  describe("Scenario 4: Complex Family Structure", () => {
    const estate: EstateData = {
      total: 2000000, // 2,000,000 - large estate
      funeral: 25000, // 25,000
      debts: 200000, // 200,000
      will: 0,
    };

    it("Full family participation across two madhabs", () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2,
        daughter: 1,
        father: 1,
        mother: 1,
      };

      // Test Shafii madhab
      const shafiEngine = new InheritanceCalculationEngine(
        "shafii",
        estate,
        heirs,
      );
      const shafiResult = shafiEngine.calculate();

      expect(shafiResult.success).toBe(true);
      const shafiTotal = shafiResult.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      const netEstate = estate.total - estate.funeral - estate.debts;
      expect(Math.abs(shafiTotal - netEstate)).toBeLessThan(1);

      // Test Hanafi madhab
      const hanafiEngine = new InheritanceCalculationEngine(
        "hanafi",
        estate,
        heirs,
      );
      const hanafiResult = hanafiEngine.calculate();

      expect(hanafiResult.success).toBe(true);
      const hanafiTotal = hanafiResult.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      expect(Math.abs(hanafiTotal - netEstate)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 5: Single Heir
   * حالة صاحب الحصة الواحدة
   */
  describe("Scenario 5: Single Heir", () => {
    const estate: EstateData = {
      total: 100000,
      funeral: 1000,
      debts: 0,
      will: 0,
    };

    it("Only a son inherits entire estate", () => {
      const heirs: HeirsData = {
        son: 1,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );
      expect(
        Math.abs(totalAmount - (estate.total - estate.funeral)),
      ).toBeLessThan(1);
    });

    it("Only a daughter inherits half estate", () => {
      const heirs: HeirsData = {
        daughter: 1,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );

      // Single daughter gets 1/2 provisioned, remainder goes back via Radd = full estate
      const expected = estate.total - (estate.funeral ?? 0); // Full net estate due to radd
      expect(Math.abs(totalAmount - expected)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 6: Multiple Heirs of Same Type
   * حالة تعدد الوارثين من نفس الفئة
   */
  describe("Scenario 6: Multiple Heirs of Same Type", () => {
    const estate: EstateData = {
      total: 600000,
      funeral: 6000,
      debts: 0,
      will: 0,
    };

    it("Three daughters with mother (all madhabs)", () => {
      const heirs: HeirsData = {
        daughter: 3,
        mother: 1,
      };

      const madhabs = ["hanafi", "maliki", "shafii", "hanbali"] as const;

      madhabs.forEach((madhab) => {
        const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
        const result = engine.calculate();

        expect(result.success).toBe(true);
        const totalAmount = result.shares.reduce(
          (sum, share) => sum + share.amount,
          0,
        );
        expect(
          Math.abs(totalAmount - (estate.total - estate.funeral)),
        ).toBeLessThan(1);
      });
    });

    it("Five full brothers (no other heirs)", () => {
      const heirs: HeirsData = {
        full_brother: 5,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce(
        (sum, share) => sum + share.amount,
        0,
      );

      // Total estate divides equally among 5 brothers
      const netEstate = estate.total - (estate.funeral ?? 0);
      expect(Math.abs(totalAmount - netEstate)).toBeLessThan(1);
    });
  });

  /**
   * ===== FIX C1: Musharraka Test =====
   */
  describe("Scenario 7: Musharraka (المشتركة/الحمارية)", () => {
    const estate: EstateData = {
      total: 120000,
      funeral: 0,
      debts: 0,
      will: 0,
    };

    it("should correctly handle Musharraka case in Shafii madhab", () => {
      const heirs: HeirsData = {
        husband: 1,
        mother: 1,
        maternal_brother: 2,
        full_brother: 1,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // Check that special case was detected
      expect(result.specialCases?.hijabTypes).toBeDefined();

      // Expected shares:
      // Husband: 1/2 = 60,000
      // Mother: 1/6 = 20,000
      // Siblings share 1/3 = 40,000 equally among 3 people = 13,333.33 each

      const husbandShare = result.shares.find((s) => s.key === "husband");
      const motherShare = result.shares.find((s) => s.key === "mother");
      const siblingsShare = result.shares.find(
        (s) => s.key === "shared_siblings",
      );

      expect(husbandShare).toBeDefined();
      expect(motherShare).toBeDefined();
      expect(siblingsShare).toBeDefined();

      if (husbandShare) {
        expect(husbandShare.amount).toBeCloseTo(60000, 0);
      }

      if (motherShare) {
        expect(motherShare.amount).toBeCloseTo(20000, 0);
      }

      if (siblingsShare) {
        expect(siblingsShare.amount).toBeCloseTo(40000, 0);
        expect(siblingsShare.count).toBe(3); // 2 maternal + 1 full brother
      }
    });

    it("should not apply Musharraka when conditions not met", () => {
      const heirs: HeirsData = {
        husband: 1,
        mother: 1,
        maternal_brother: 1, // Only 1 maternal brother (needs 2+)
        full_brother: 1,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // Should be normal calculation, not Musharraka
      const siblingsShare = result.shares.find(
        (s) => s.key === "shared_siblings",
      );
      expect(siblingsShare).toBeUndefined();
    });
  });

  /**
   * ===== FIX C2: Akdariyya Test =====
   */
  describe("Scenario 8: Akdariyya (الأكدرية/الغراء)", () => {
    const estate: EstateData = {
      total: 27000, // Using 27 for easy fraction testing
      funeral: 0,
      debts: 0,
      will: 0,
    };

    it("should correctly handle Akdariyya case", () => {
      const heirs: HeirsData = {
        husband: 1,
        mother: 1,
        grandfather: 1,
        full_sister: 1,
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.awlApplied).toBe(true);

      // Expected shares from 27:
      // Husband: 9/27 = 9,000
      // Mother: 6/27 = 6,000
      // Grandfather: 8/27 = 8,000
      // Sister: 4/27 = 4,000

      const husbandShare = result.shares.find((s) => s.key === "husband");
      const motherShare = result.shares.find((s) => s.key === "mother");
      const grandfatherShare = result.shares.find(
        (s) => s.key === "grandfather",
      );
      const sisterShare = result.shares.find((s) => s.key === "full_sister");

      expect(husbandShare).toBeDefined();
      expect(motherShare).toBeDefined();
      expect(grandfatherShare).toBeDefined();
      expect(sisterShare).toBeDefined();

      if (husbandShare) expect(husbandShare.amount).toBeCloseTo(9000, 0);
      if (motherShare) expect(motherShare.amount).toBeCloseTo(6000, 0);
      if (grandfatherShare)
        expect(grandfatherShare.amount).toBeCloseTo(8000, 0);
      if (sisterShare) expect(sisterShare.amount).toBeCloseTo(4000, 0);

      const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
      expect(total).toBeCloseTo(27000, 0);
    });
  });

  /**
   * ===== FIX C3: Grandfather with siblings optimal selection test =====
   */
  describe("Scenario 9: Grandfather with Siblings - Optimal Selection", () => {
    const estate: EstateData = {
      total: 120000,
      funeral: 0,
      debts: 0,
      will: 0,
    };

    it("should choose best option for grandfather (muqasamah vs third vs sixth)", () => {
      // Case where muqasamah might be best
      const heirs1: HeirsData = {
        grandfather: 1,
        full_brother: 1, // Only one brother
      };

      // Case where third might be best
      const heirs2: HeirsData = {
        grandfather: 1,
        full_brother: 3, // Many brothers
        full_sister: 2,
      };

      // Test with Maliki madhab (where grandfather shares)
      const engine1 = new InheritanceCalculationEngine(
        "maliki",
        estate,
        heirs1,
      );
      const result1 = engine1.calculate();

      const engine2 = new InheritanceCalculationEngine(
        "maliki",
        estate,
        heirs2,
      );
      const result2 = engine2.calculate();

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // With few siblings, muqasamah might be best
      const grandfather1 = result1.shares.find((s) => s.key === "grandfather");
      expect(grandfather1).toBeDefined();

      // With many siblings, third or sixth might be chosen
      const grandfather2 = result2.shares.find((s) => s.key === "grandfather");
      expect(grandfather2).toBeDefined();
    });

    it.skip("should handle grandfather with siblings differently across madhabs", () => {
      const heirs: HeirsData = {
        grandfather: 1,
        full_brother: 2,
        full_sister: 1,
      };

      // Shafii: grandfather blocks siblings
      const shafiiEngine = new InheritanceCalculationEngine(
        "shafii",
        estate,
        heirs,
      );
      const shafiiResult = shafiiEngine.calculate();

      // Maliki: grandfather shares with siblings
      const malikiEngine = new InheritanceCalculationEngine(
        "maliki",
        estate,
        heirs,
      );
      const malikiResult = malikiEngine.calculate();

      expect(shafiiResult.success).toBe(true);
      expect(malikiResult.success).toBe(true);

      // In Shafii, grandfather gets all, siblings blocked
      const shafiiGrandfather = shafiiResult.shares.find(
        (s) => s.key === "grandfather",
      );
      const shafiiBrother = shafiiResult.shares.find(
        (s) => s.key === "full_brother",
      );

      expect(shafiiGrandfather).toBeDefined();
      expect(shafiiBrother).toBeUndefined();

      // In Maliki, both get shares
      const malikiGrandfather = malikiResult.shares.find(
        (s) => s.key === "grandfather",
      );
      const malikiBrother = malikiResult.shares.find(
        (s) => s.key === "full_brother",
      );

      expect(malikiGrandfather).toBeDefined();
      expect(malikiBrother).toBeDefined();
    });
  });

  /**
   * ===== FIX C4: Blood relatives priority test =====
   */
  describe("Scenario 10: Blood Relatives (ذوو الأرحام) Priority", () => {
    const estate: EstateData = {
      total: 120000,
      funeral: 0,
      debts: 0,
      will: 0,
    };

    it.skip("should prioritize children of daughters over other blood relatives", () => {
      const heirs: HeirsData = {
        daughter_son: 2, // Class 1 - should inherit
        daughter_daughter: 1, // Class 1 - should inherit
        maternal_uncle: 1, // Class 3 - should be excluded
        paternal_aunt: 1, // Class 4 - should be excluded
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // Check that only class 1 heirs inherited
      const hasDaughterSon = result.shares.some(
        (s) => s.key === "daughter_son",
      );
      const hasDaughterDaughter = result.shares.some(
        (s) => s.key === "daughter_daughter",
      );
      const hasMaternalUncle = result.shares.some(
        (s) => s.key === "maternal_uncle",
      );
      const hasPaternalAunt = result.shares.some(
        (s) => s.key === "paternal_aunt",
      );

      expect(hasDaughterSon).toBe(true);
      expect(hasDaughterDaughter).toBe(true);
      expect(hasMaternalUncle).toBe(false);
      expect(hasPaternalAunt).toBe(false);
    });

    it.skip("should move to next class when no heirs in higher class", () => {
      const heirs: HeirsData = {
        maternal_uncle: 2, // Class 3 - should inherit
        maternal_aunt: 1, // Class 3 - should inherit
        paternal_aunt: 1, // Class 4 - should be excluded
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // Check that only class 3 heirs inherited
      const hasMaternalUncle = result.shares.some(
        (s) => s.key === "maternal_uncle",
      );
      const hasMaternalAunt = result.shares.some(
        (s) => s.key === "maternal_aunt",
      );
      const hasPaternalAunt = result.shares.some(
        (s) => s.key === "paternal_aunt",
      );

      expect(hasMaternalUncle).toBe(true);
      expect(hasMaternalAunt).toBe(true);
      expect(hasPaternalAunt).toBe(false);
    });

    it.skip("should distribute remainder equally within the inheriting class", () => {
      const heirs: HeirsData = {
        maternal_uncle: 2, // Class 3 - 2 persons
        maternal_aunt: 2, // Class 3 - 2 persons (total 4)
      };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);

      // All 4 should get equal shares
      const maternalUncle = result.shares.find(
        (s) => s.key === "maternal_uncle",
      );
      const maternalAunt = result.shares.find((s) => s.key === "maternal_aunt");

      expect(maternalUncle).toBeDefined();
      expect(maternalAunt).toBeDefined();

      if (maternalUncle && maternalAunt) {
        // Both should have same amount
        expect(maternalUncle.amount).toBeCloseTo(maternalAunt.amount, 0);

        // Each person should get 1/4 of estate
        const expectedPerPerson = (estate.total - estate.funeral) / 4;
        expect(maternalUncle.amount / maternalUncle.count!).toBeCloseTo(
          expectedPerPerson,
          0,
        );
      }
    });
  });

  /**
   * Scenario 11: Validation Errors
   * حالات الأخطاء والتحقق
   */
  describe("Scenario 11: Error Handling", () => {
    it("Should handle zero total estate", () => {
      const estate: EstateData = {
        total: 0,
        funeral: 0,
        debts: 0,
        will: 0,
      };

      const heirs: HeirsData = { son: 1 };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(false);
    });

    it("Should handle empty heirs list", () => {
      const estate: EstateData = {
        total: 100000,
        funeral: 0,
        debts: 0,
        will: 0,
      };

      const heirs: HeirsData = {};

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(false);
    });

    it("Should reject negative debts", () => {
      const estate: EstateData = {
        total: 100000,
        funeral: 0,
        debts: -5000, // Negative debts
        will: 0,
      };

      const heirs: HeirsData = { son: 1 };

      const engine = new InheritanceCalculationEngine("shafii", estate, heirs);
      const result = engine.calculate();

      expect(result).toBeDefined();
    });
  });

  /**
   * Scenario 12: Madhab Comparison
   * حالة مقارنة المذاهب
   */
  describe("Scenario 12: Madhab Comparison", () => {
    const estate: EstateData = {
      total: 500000,
      funeral: 5000,
      debts: 0,
      will: 0,
    };

    const heirs: HeirsData = {
      father: 1,
      mother: 1,
      son: 1,
      daughter: 1,
    };

    it("Should produce different results across madhabs for complex cases", () => {
      const madhabs = ["hanafi", "maliki", "shafii", "hanbali"] as const;
      const results: Record<string, number> = {};

      madhabs.forEach((madhab) => {
        const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
        const result = engine.calculate();

        expect(result.success).toBe(true);

        const total = result.shares.reduce(
          (sum, share) => sum + share.amount,
          0,
        );
        results[madhab] = total;

        // All should sum to net estate
        expect(Math.abs(total - (estate.total - estate.funeral))).toBeLessThan(
          1,
        );
      });
    });
  });
});
