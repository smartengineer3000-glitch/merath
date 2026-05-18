#!/bin/bash
# fix-remaining.sh – Resolve all remaining TypeScript errors
set -e

echo "🔧 Fixing remaining TS errors..."

# 1. Exclude backup folders from TypeScript
if [ -f tsconfig.json ]; then
  if ! grep -q '"exclude"' tsconfig.json; then
    sed -i 's/"compilerOptions"/"exclude": ["lib\/engine.bak.*"],\n  "compilerOptions"/' tsconfig.json
  fi
fi

# 2. Fix test imports (they point to ../lib/inheritance/types, should be ../lib/engine/types)
for file in __tests__/real-world-scenarios.test.ts __tests__/special-cases.test.ts; do
  sed -i "s|from '../lib/inheritance/types'|from '../lib/engine/types'|g" "$file"
  sed -i "s|from '../lib/inheritance'|from '../lib/engine/calculator'|g" "$file"
done

# 3. Fix HeirSelector and CalcContext imports (they import types that don't exist)
sed -i "s|import { HeirType, HeirEntry } from '../lib/engine/types';|import { HeirType, HeirEntry } from '../lib/engine/types';\nimport type { HeirEntry } from '../lib/engine/types';|" components/HeirSelector.tsx 2>/dev/null || true
# Actually we need to export HeirEntry from types, let's add it
if ! grep -q "export interface HeirEntry" lib/engine/types.ts; then
  echo "export interface HeirEntry { type: HeirType; count: number; }" >> lib/engine/types.ts
fi
# Also export EstateInput
if ! grep -q "export interface EstateInput" lib/engine/types.ts; then
  echo "export interface EstateInput { total: number; funeral: number; debts: number; will: number; }" >> lib/engine/types.ts
fi

# Fix applyHijab export – if it's not exported, export it
if ! grep -q "export function applyHijab" lib/engine/hijab.ts; then
  sed -i 's/function applyHijab/export function applyHijab/' lib/engine/hijab.ts
fi

# 4. Clean up the engine's corrupted line (if (shares) ...)
sed -i '/if (shares) { shares = shares.map/d' lib/engine/calculator.ts
sed -i '/if (!success) { success = true; }/d' lib/engine/calculator.ts

# 5. Export calculateInheritance from calculator (alias the class's calculate)
if ! grep -q "export function calculateInheritance" lib/engine/calculator.ts; then
  echo "" >> lib/engine/calculator.ts
  echo "export function calculateInheritance(madhab: any, estate: any, heirs: any) {" >> lib/engine/calculator.ts
  echo "  const engine = new EnhancedInheritanceCalculationEngine(madhab, estate, heirs);" >> lib/engine/calculator.ts
  echo "  return engine.calculate();" >> lib/engine/calculator.ts
  echo "}" >> lib/engine/calculator.ts
fi

# 6. Fix Results.tsx width type (use template literal as any)
sed -i "s/width: result.confidence + '%'/width: `${result.confidence}%` as any/" screens/Results.tsx

# 7. Run TypeScript check
echo "🧪 Running TypeScript check..."
npx tsc --noEmit

echo ""
echo "✅ If no errors appear, run 'npm test' and commit."
