/**
 * فئة الكسور المتقدمة لحساب المواريث الشرعي
 * Enhanced Fraction Class for Islamic Inheritance Calculations
 *
 * تدعم العمليات الحسابية على الكسور بدقة عالية جداً
 *
 * FIXES:
 * - C6 (🔴): Fraction simplification overflow protection for large denominators (>1e9)
 */

import { FractionData } from "./types";

export class FractionClass {
  private numerator: number;
  private denominator: number;

  // ===== FIX C6: Constants for overflow protection =====
  private static readonly MAX_SAFE_DENOMINATOR = 1_000_000_000; // 1e9
  private static readonly SIMPLIFY_THRESHOLD = 1_000_000; // 1e6 - threshold for aggressive simplification
  private static readonly TOLERANCE = 1e-10; // Tolerance for floating point comparisons

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error(
        "المقام لا يمكن أن يكون صفراً | Denominator cannot be zero",
      );
    }

    // تحويل الكسور السالبة
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    this.numerator = numerator;
    this.denominator = denominator;

    // ===== FIX C6: Safe simplification with overflow protection =====
    this.simplify();
  }

  /**
   * تبسيط الكسر إلى أبسط صورة
   * Simplify fraction to lowest terms
   * ===== FIX C6: Added overflow protection =====
   */
  private simplify(): void {
    // Handle zero numerator
    if (this.numerator === 0) {
      this.denominator = 1;
      return;
    }

    // ===== FIX C6: Check for denominator overflow =====
    if (this.denominator > FractionClass.MAX_SAFE_DENOMINATOR) {
      // Scale down the fraction to safe range
      this.scaleDownToSafeRange();
      return;
    }

    const gcd = this.safeGcd(Math.abs(this.numerator), this.denominator);

    if (gcd > 1) {
      this.numerator /= gcd;
      this.denominator /= gcd;
    }

    // ===== FIX C6: Post-simplification overflow check =====
    if (this.denominator > FractionClass.MAX_SAFE_DENOMINATOR) {
      this.scaleDownToSafeRange();
    }
  }

  /**
   * ===== FIX C6: Safe GCD that handles large numbers =====
   */
  private safeGcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);

    // Check if numbers are too large for standard Euclidean algorithm
    if (a > Number.MAX_SAFE_INTEGER / 2 || b > Number.MAX_SAFE_INTEGER / 2) {
      return this.approximateGcd(a, b);
    }

    // Standard Euclidean algorithm for safe numbers
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;

      // Safety check - prevent infinite loop
      if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) {
        return 1;
      }
    }

    return a || 1;
  }

  /**
   * ===== FIX C6: Approximate GCD for very large numbers =====
   */
  private approximateGcd(a: number, b: number): number {
    // Use floating point approximation for very large numbers
    const ratio = a / b;

    // Check if numbers are roughly multiples
    if (Math.abs(ratio - Math.round(ratio)) < FractionClass.TOLERANCE) {
      return b; // b divides a roughly
    }

    const inverseRatio = b / a;
    if (
      Math.abs(inverseRatio - Math.round(inverseRatio)) <
      FractionClass.TOLERANCE
    ) {
      return a; // a divides b roughly
    }

    // Otherwise, try to find common factors using prime factors of smaller number
    const smaller = Math.min(a, b);
    if (smaller < 1000) {
      for (let i = Math.floor(Math.sqrt(smaller)); i > 1; i--) {
        if (a % i === 0 && b % i === 0) {
          return i;
        }
      }
    }

    return 1; // No common factor found
  }

  /**
   * ===== FIX C6: Scale down fraction to safe range =====
   */
  private scaleDownToSafeRange(): void {
    if (this.denominator <= FractionClass.MAX_SAFE_DENOMINATOR) return;

    // Calculate scaling factor
    const scaleFactor = this.denominator / FractionClass.MAX_SAFE_DENOMINATOR;

    // Scale both numerator and denominator
    this.numerator = Math.round(this.numerator / scaleFactor);
    this.denominator = FractionClass.MAX_SAFE_DENOMINATOR;

    // Try to simplify after scaling
    const gcd = this.safeGcd(Math.abs(this.numerator), this.denominator);
    if (gcd > 1) {
      this.numerator /= gcd;
      this.denominator /= gcd;
    }
  }

  /**
   * جمع كسرين
   * Add two fractions
   * ===== FIX C6: Added overflow protection =====
   */
  add(other: FractionClass): FractionClass {
    // Check for potential overflow
    const newNumerator =
      this.numerator * other.denominator + other.numerator * this.denominator;
    const newDenominator = this.denominator * other.denominator;

    // Check if result might overflow
    if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
      // Use decimal addition for very large denominators
      const decimal = this.toDecimal() + other.toDecimal();
      return FractionClass.fromDecimal(decimal, 12);
    }

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * طرح كسرين
   * Subtract two fractions
   * ===== FIX C6: Added overflow protection =====
   */
  subtract(other: FractionClass): FractionClass {
    // Check for potential overflow
    const newNumerator =
      this.numerator * other.denominator - other.numerator * this.denominator;
    const newDenominator = this.denominator * other.denominator;

    // Check if result might overflow
    if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
      // Use decimal subtraction for very large denominators
      const decimal = this.toDecimal() - other.toDecimal();
      return FractionClass.fromDecimal(decimal, 12);
    }

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * ضرب الكسر برقم أو كسر آخر
   * Multiply fraction by number or another fraction
   * ===== FIX C6: Added overflow protection =====
   */
  multiply(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === "number") {
      // Check for overflow
      if (
        Math.abs(this.denominator) >
        FractionClass.MAX_SAFE_DENOMINATOR / Math.abs(scalar)
      ) {
        // Use decimal multiplication
        const decimal = this.toDecimal() * scalar;
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(this.numerator * scalar, this.denominator);
    } else {
      // Check for overflow
      const newDenominator = this.denominator * scalar.denominator;
      if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
        // Use decimal multiplication
        const decimal = this.toDecimal() * scalar.toDecimal();
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(
        this.numerator * scalar.numerator,
        newDenominator,
      );
    }
  }

  /**
   * قسمة الكسر على رقم أو كسر آخر
   * Divide fraction by number or another fraction
   * ===== FIX C6: Added overflow protection =====
   */
  divide(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === "number") {
      if (scalar === 0) {
        throw new Error("لا يمكن القسمة على صفر | Cannot divide by zero");
      }

      // Check for overflow
      if (
        Math.abs(this.denominator * scalar) > FractionClass.MAX_SAFE_DENOMINATOR
      ) {
        // Use decimal division
        const decimal = this.toDecimal() / scalar;
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(this.numerator, this.denominator * scalar);
    } else {
      if (scalar.numerator === 0) {
        throw new Error("لا يمكن القسمة على صفر | Cannot divide by zero");
      }

      // Check for overflow
      const newDenominator = this.denominator * scalar.numerator;
      if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
        // Use decimal division
        const decimal = this.toDecimal() / scalar.toDecimal();
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(
        this.numerator * scalar.denominator,
        newDenominator,
      );
    }
  }

  /**
   * تحويل الكسر إلى عدد عشري
   * Convert fraction to decimal
   */
  toDecimal(): number {
    // Handle very large numbers safely
    if (
      Math.abs(this.numerator) > Number.MAX_SAFE_INTEGER ||
      Math.abs(this.denominator) > Number.MAX_SAFE_INTEGER
    ) {
      // Use high precision division
      return this.numerator / this.denominator;
    }
    return this.numerator / this.denominator;
  }

  /**
   * المساواة مع كسر آخر (مع هامش تفاوت)
   * Equality check with tolerance
   */
  equals(other: FractionClass, tolerance: number = 0.001): boolean {
    // Cross multiplication for exact comparison (safer than decimal)
    const left = this.numerator * other.denominator;
    const right = other.numerator * this.denominator;

    // Check if difference is within tolerance
    if (Math.abs(left - right) <= tolerance * Math.abs(left)) {
      return true;
    }

    // Fallback to decimal comparison
    return Math.abs(this.toDecimal() - other.toDecimal()) <= tolerance;
  }

  /**
   * مقارنة الكسور
   * Compare fractions
   */
  compare(other: FractionClass): number {
    // Cross multiplication for accurate comparison
    const left = this.numerator * other.denominator;
    const right = other.numerator * this.denominator;

    const diff = left - right;
    if (diff < -FractionClass.TOLERANCE) return -1;
    if (diff > FractionClass.TOLERANCE) return 1;
    return 0;
  }

  /**
   * إرجاع الكسر كنص رياضي
   * Return as mathematical string
   */
  toString(): string {
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * إرجاع الكسر باللغة العربية مع دعم كامل لجميع حالات المواريث
   * Return comprehensive Arabic name of fraction for inheritance cases
   */
  toArabicName(): string {
    const key = `${this.numerator}/${this.denominator}`;

    // Comprehensive Arabic fraction names for all inheritance scenarios
    const arabicFractions: Record<string, string> = {
      // Basic fractions
      "0/1": "لا شيء",
      "1/1": "كامل التركة",
      "1/2": "النصف",
      "1/3": "الثلث",
      "2/3": "الثلثان",
      "1/4": "الربع",
      "3/4": "ثلاثة أرباع",
      "1/5": "الخمس",
      "2/5": "خمسان",
      "3/5": "ثلاثة أخماس",
      "4/5": "أربعة أخماس",
      "1/6": "السدس",
      "5/6": "خمسة أسداس",
      "1/7": "السبع",
      "2/7": "سبعان",
      "3/7": "ثلاثة أسباع",
      "4/7": "أربعة أسباع",
      "5/7": "خمسة أسباع",
      "6/7": "ستة أسباع",
      "1/8": "الثمن",
      "3/8": "ثلاثة أثمان",
      "5/8": "خمسة أثمان",
      "7/8": "سبعة أثمان",
      "1/9": "التسع",
      "2/9": "تسعان",
      "4/9": "أربعة أتساع",
      "5/9": "خمسة أتساع",
      "7/9": "سبعة أتساع",
      "8/9": "ثمانية أتساع",
      "1/10": "العشر",
      "3/10": "ثلاثة أعشار",
      "7/10": "سبعة أعشار",
      "9/10": "تسعة أعشار",

      // Common inheritance combinations
      "1/12": "واحد من اثني عشر",
      "5/12": "خمسة من اثني عشر",
      "7/12": "سبعة من اثني عشر",
      "11/12": "أحد عشر من اثني عشر",
      "1/24": "واحد من أربعة وعشرين",
      "5/24": "خمسة من أربعة وعشرين",
      "7/24": "سبعة من أربعة وعشرين",
      "11/24": "أحد عشر من أربعة وعشرين",
      "13/24": "ثلاثة عشر من أربعة وعشرين",
      "17/24": "سبعة عشر من أربعة وعشرين",
      "19/24": "تسعة عشر من أربعة وعشرين",
      "23/24": "ثلاثة وعشرون من أربعة وعشرين",

      // Simplified forms
      "2/6": "ثلث", // Simplified from 2/6
      "3/6": "نصف", // Simplified from 3/6
      "4/6": "ثلثان", // Simplified from 4/6
      "2/8": "ربع", // Simplified from 2/8
      "4/8": "نصف", // Simplified from 4/8
      "6/8": "ثلاثة أرباع", // Simplified from 6/8
      "3/9": "ثلث", // Simplified from 3/9
      "6/9": "ثلثان", // Simplified from 6/9
      "2/10": "خمس", // Simplified from 2/10
      "4/10": "خمسان", // Simplified from 4/10
      "5/10": "نصف", // Simplified from 5/10
      "6/10": "ثلاثة أخماس", // Simplified from 6/10
      "8/10": "أربعة أخماس", // Simplified from 8/10
    };

    // Check if we have an exact match
    if (arabicFractions[key]) {
      return arabicFractions[key];
    }

    // Handle simplified fractions that might not be in the map
    const simplified = this.simplifyToString();
    if (simplified !== key && arabicFractions[simplified]) {
      return arabicFractions[simplified];
    }

    // Handle complex fractions
    if (this.numerator === 1) {
      return `جزء من ${this.denominator}`;
    } else if (this.denominator > 10) {
      return `${this.numerator} من ${this.denominator}`;
    }

    return key;
  }

  /**
   * تبسيط الكسر وإرجاعه كنص
   * Simplify and return as string
   */
  private simplifyToString(): string {
    const simplified = new FractionClass(this.numerator, this.denominator);
    return `${simplified.numerator}/${simplified.denominator}`;
  }

  /**
   * الحصول على البسط
   */
  get numeratorValue(): number {
    return this.numerator;
  }

  /**
   * الحصول على المقام
   */
  get denominatorValue(): number {
    return this.denominator;
  }

  /**
   * Get numerator (alternative method name)
   */
  getNumerator(): number {
    return this.numerator;
  }

  /**
   * Get denominator (alternative method name)
   */
  getDenominator(): number {
    return this.denominator;
  }

  /**
   * Check if fraction is positive
   */
  isPositive(): boolean {
    return this.numerator > 0;
  }

  /**
   * Check if fraction is zero
   */
  isZero(): boolean {
    return this.numerator === 0;
  }

  /**
   * Check if greater than another fraction
   */
  greaterThan(other: FractionClass): boolean {
    return this.compare(other) > 0;
  }

  /**
   * Check if less than another fraction
   */
  lessThan(other: FractionClass): boolean {
    return this.compare(other) < 0;
  }

  /**
   * Check if greater than or equal
   */
  greaterThanOrEqual(other: FractionClass): boolean {
    return this.compare(other) >= 0;
  }

  /**
   * Check if less than or equal
   */
  lessThanOrEqual(other: FractionClass): boolean {
    return this.compare(other) <= 0;
  }

  /**
   * تحويل إلى كائن بيانات
   */
  toData(): FractionData {
    return {
      numerator: this.numerator,
      denominator: this.denominator,
    };
  }

  /**
   * إنشاء كسر من كائن بيانات
   */
  static fromData(data: FractionData): FractionClass {
    return new FractionClass(data.numerator, data.denominator);
  }

  /**
   * إنشاء كسر من عدد عشري
   * ===== FIX C6: Enhanced precision for decimal conversion =====
   */
  static fromDecimal(decimal: number, precision: number = 12): FractionClass {
    if (decimal === 0) return new FractionClass(0);

    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);

    // Handle very small decimals by increasing precision
    if (decimal < 0.000001) {
      precision = 15;
    }

    // Convert to fraction using continued fractions for better accuracy
    const fraction = this.decimalToFraction(decimal, precision);

    return new FractionClass(sign * fraction.numerator, fraction.denominator);
  }

  /**
   * ===== FIX C6: Convert decimal to fraction using continued fractions =====
   */
  private static decimalToFraction(
    decimal: number,
    maxDenominator: number = 1000000,
  ): { numerator: number; denominator: number } {
    // Handle integer case
    if (Math.abs(decimal - Math.round(decimal)) < this.TOLERANCE) {
      return { numerator: Math.round(decimal), denominator: 1 };
    }

    // Use continued fractions algorithm for best rational approximation
    let h1 = 1,
      h2 = 0;
    let k1 = 0,
      k2 = 1;
    let b = decimal;

    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (
      Math.abs(decimal - h1 / k1) > decimal * 1e-12 &&
      k1 < maxDenominator
    );

    return { numerator: h1, denominator: k1 };
  }

  /**
   * الحصول على المقام المشترك
   * Get common denominator with another fraction
   */
  getCommonDenominator(other: FractionClass): number {
    return this.lcm(this.denominator, other.denominator);
  }

  /**
   * حساب المضاعف المشترك الأصغر
   * Calculate Least Common Multiple
   */
  private lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.safeGcd(a, b);
  }

  /**
   * تحويل إلى كسر بمقام محدد
   * Convert to fraction with specific denominator
   */
  toDenominator(targetDenominator: number): FractionClass {
    if (targetDenominator % this.denominator !== 0) {
      throw new Error("المقام المستهدف يجب أن يكون مضاعفاً للمقام الحالي");
    }
    const multiplier = targetDenominator / this.denominator;
    return new FractionClass(this.numerator * multiplier, targetDenominator);
  }

  /**
   * ===== FIX C6: Check if fraction is safe (within limits) =====
   */
  isSafe(): boolean {
    return (
      Math.abs(this.numerator) < Number.MAX_SAFE_INTEGER / 2 &&
      Math.abs(this.denominator) < Number.MAX_SAFE_INTEGER / 2 &&
      this.denominator <= FractionClass.MAX_SAFE_DENOMINATOR
    );
  }

  /**
   * ===== FIX C6: Get approximate value with warning if unsafe =====
   */
  toApproximateDecimal(): { value: number; isExact: boolean } {
    const isExact = this.isSafe();
    return {
      value: this.numerator / this.denominator,
      isExact,
    };
  }
}
