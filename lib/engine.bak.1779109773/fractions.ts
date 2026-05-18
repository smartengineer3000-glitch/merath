export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplify(n: number, d: number): [number, number] {
  const g = gcd(Math.abs(n), Math.abs(d));
  return [n / g, d / g];
}

export function addFractions(f1: [number,number], f2: [number,number]): [number,number] {
  const [n1, d1] = f1, [n2, d2] = f2;
  return simplify(n1 * d2 + n2 * d1, d1 * d2);
}
