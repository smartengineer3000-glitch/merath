#!/bin/bash
# add-tests.sh – Add comprehensive tests without overwriting existing ones
set -e

echo "🧪 Adding full test suite (preserving existing tests)..."

# 1. Install test dependencies
npm install --save-dev vitest jsdom @testing-library/react-native 2>/dev/null || true

# 2. Ensure __tests__ directory exists (already does, but safe)
mkdir -p __tests__

# 3. Engine & hijab tests (does NOT overwrite calculator.test.ts)
cat > __tests__/engine.test.ts << 'EOF'
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
EOF

# 4. UI component tests
cat > __tests__/components.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

describe('UI Components', () => {
  it('Button renders title', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('Card renders children', () => {
    const { getByText } = render(<Card><Button title="Inside Card" onPress={() => {}} /></Card>);
    expect(getByText('Inside Card')).toBeTruthy();
  });

  it('Input shows label', () => {
    const { getByText } = render(<Input label="Name" value="" onChangeText={() => {}} />);
    expect(getByText('Name')).toBeTruthy();
  });
});
EOF

# 5. History logic test
cat > __tests__/history.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('History Storage', () => {
  it('saves and retrieves history', async () => {
    const entry = { date: new Date().toISOString(), madhab: 'hanafi', netTotal: 1000, shares: [] };
    await AsyncStorage.setItem('merath_history', JSON.stringify([entry]));
    const stored = await AsyncStorage.getItem('merath_history');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].netTotal).toBe(1000);
  });
});
EOF

# 6. PieChart component test
cat > __tests__/piechart.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { PieChart } from '../components/PieChart';

describe('PieChart', () => {
  it('renders without crashing', () => {
    const data = [{ label: 'Son', value: 500, color: '#1B6B4A' }];
    const { getByText } = render(<PieChart data={data} size={100} />);
    expect(getByText('Son')).toBeTruthy();
  });
});
EOF

# 7. Ensure vitest config is correct
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    globals: true,
  },
});
EOF

echo ""
echo "✅ Full test suite added (original calculator.test.ts untouched)."
echo "   Run: npm test"