#!/bin/bash
# enhance-final.sh – Add animated numbers, toggle, history, share text, deep‑link, accessibility, confidence, tooltip
set -e

echo "✨ Applying final professional enhancements..."

# Ensure we're inside the merath directory
if [ ! -f App.tsx ]; then
  echo "❌ Run this script inside the merath folder!"
  exit 1
fi

# Install additional packages for deep‑linking, clipboard, toast (we'll use a simple approach)
npm install expo-linking expo-clipboard 2>/dev/null || true

# ─────────────────────────────────────────────
# 1. Enhanced Results screen
# ─────────────────────────────────────────────
echo "📱 Upgrading Results screen..."
cat > screens/Results.tsx << 'RESULTS'
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Switch, Clipboard, Alert } from 'react-native';
import { useCalc } from '../lib/context/CalcContext';
import { calculateInheritance } from '../lib/engine/calculator';
import { useAppTheme } from '../hooks/useAppTheme';
import { ExportBar } from '../components/ExportBar';
import { ResultsSkeleton } from '../components/SkeletonCard';
import { Button } from '../components/ui/Button';

const AnimatedNumber = ({ value, style }: { value: number; style?: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value]);
  const display = animatedValue.interpolate({
    inputRange: [0, value],
    outputRange: [0, value],
    extrapolate: 'clamp',
  });
  return <Animated.Text style={style}>{display}</Animated.Text>;
};

export const Results = ({ navigation }: any) => {
  const { state } = useCalc();
  const theme = useAppTheme();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPercentage, setShowPercentage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const estate = { total: state.total, funeral: state.funeral, debts: state.debts, will: state.will };
      const res = calculateInheritance(state.madhab, estate, state.heirs);
      // Dynamic confidence: penalize if net estate is 0, or if no heirs selected
      let confidence = 100;
      if (res.netTotal <= 0) confidence -= 50;
      if (state.heirs.length === 0) confidence -= 30;
      res.confidence = Math.max(confidence, 10);
      setResult(res);
      setLoading(false);
      // Save to history
      saveCalculation(state.madhab, res);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const saveCalculation = async (madhab: string, data: any) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem('merath_history');
      const history = stored ? JSON.parse(stored) : [];
      history.unshift({ date: new Date().toISOString(), madhab, netTotal: data.netTotal, shares: data.shares });
      if (history.length > 10) history.pop();
      await AsyncStorage.setItem('merath_history', JSON.stringify(history));
    } catch (e) {}
  };

  const copyAsText = () => {
    let text = `Net Estate: $${result.netTotal.toLocaleString()}\n\n`;
    result.shares.forEach((s: any) => {
      text += `${s.name}: $${s.amount.toFixed(2)} (${s.fraction.numerator}/${s.fraction.denominator})\n`;
    });
    Clipboard.setStringAsync?.(text) || Alert.alert('Copied', 'Results copied to clipboard');
  };

  const totalEstate = result?.netTotal || 0;
  const confidenceColor = result?.confidence >= 70 ? theme.colors.success : result?.confidence >= 40 ? theme.colors.warning : theme.colors.error;

  if (loading) return <ResultsSkeleton />;

  return (
    <ExportBar resultData={result}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, padding: theme.spacing.lg, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.onPrimary, fontSize: 24 }}>Net Estate</Text>
          <AnimatedNumber value={totalEstate} style={{ color: theme.colors.onPrimary, fontSize: 48 }} />
        </View>

        {/* Confidence Meter */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
          <View style={{ height: 10, flex: 1, backgroundColor: theme.colors.surfaceVariant, borderRadius: 5, overflow: 'hidden' }}>
            <View style={{ height: 10, width: `${result.confidence}%`, backgroundColor: confidenceColor, borderRadius: 5 }} />
          </View>
          <Text style={{ marginLeft: 8, color: confidenceColor, fontWeight: '600' }}>{result.confidence}%</Text>
        </View>
        <Text style={theme.typography.caption}>Confidence based on completeness of inputs</Text>

        {/* Fraction / Percentage Toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginVertical: 12 }}>
          <Text style={{ marginRight: 8 }}>Fractions</Text>
          <Switch value={showPercentage} onValueChange={setShowPercentage} />
          <Text style={{ marginLeft: 8 }}>Percentages</Text>
        </View>

        <Text style={theme.typography.h2}>Distribution</Text>
        {result.shares.map((share: any, idx: number) => {
          const displayAmount = showPercentage
            ? `${((share.amount / totalEstate) * 100).toFixed(1)}%`
            : `$${share.amount.toFixed(2)}`;
          return (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderColor: theme.colors.outline }}>
              <Text style={theme.typography.body}>{share.name} ({share.fraction.numerator}/{share.fraction.denominator})</Text>
              <Text style={theme.typography.body}>{displayAmount}</Text>
            </View>
          );
        })}

        {/* Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: theme.spacing.lg }}>
          <Button title="Compare Schools" onPress={() => navigation.navigate('Comparison')} mode="outlined" />
          <Button title="History" onPress={() => navigation.navigate('History')} mode="outlined" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: theme.spacing.sm }}>
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} mode="outlined" />
          <Button title="Copy Text" onPress={copyAsText} mode="outlined" />
        </View>
      </ScrollView>
    </ExportBar>
  );
};
RESULTS

# ─────────────────────────────────────────────
# 2. History screen
# ─────────────────────────────────────────────
echo "📜 Adding History screen..."
cat > screens/History.tsx << 'HISTORY'
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';

export const History = ({ navigation }: any) => {
  const theme = useAppTheme();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('merath_history');
      if (stored) setHistory(JSON.parse(stored));
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={theme.typography.h1}>Recent Calculations</Text>
      {history.length === 0 ? (
        <Text style={theme.typography.body}>No recent calculations.</Text>
      ) : (
        history.map((entry, idx) => (
          <TouchableOpacity key={idx} style={{ backgroundColor: theme.colors.surface, padding: 12, marginBottom: 8, borderRadius: 8 }} onPress={() => {}}>
            <Text style={theme.typography.body}>{new Date(entry.date).toLocaleString()}</Text>
            <Text>Net: ${entry.netTotal}</Text>
            {entry.shares.map((s: any, i: number) => (
              <Text key={i}>• {s.name}: ${s.amount.toFixed(2)}</Text>
            ))}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
HISTORY

# ─────────────────────────────────────────────
# 3. Deep‑link support
# ─────────────────────────────────────────────
echo "🔗 Adding deep‑linking..."
# Update app.config.ts (or app.config.js) to include scheme and intent filters
if [ -f app.config.ts ]; then
  # Insert scheme into existing config
  if ! grep -q "scheme:" app.config.ts; then
    sed -i "s/export default {/export default {\n  scheme: 'merath',/" app.config.ts
  fi
elif [ -f app.config.js ]; then
  if ! grep -q "scheme:" app.config.js; then
    sed -i "s/export default {/export default {\n  scheme: 'merath',/" app.config.js
  fi
else
  # Create minimal app.config.ts
  cat > app.config.ts << 'CONFIG'
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Merath',
  slug: 'merath',
  scheme: 'merath',
  android: {
    package: 'com.merath_mobile.merath',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          { scheme: 'merath', host: '*', pathPrefix: '/' },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
});
CONFIG
fi

# Update navigation to handle deep links
cat > navigation/RootNavigator.tsx << 'NAV'
import React, { useEffect } from 'react';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalcProvider } from '../lib/context/CalcContext';
import { EstateSetup } from '../screens/EstateSetup';
import { MadhabSelect } from '../screens/MadhabSelect';
import { HeirSelection } from '../screens/HeirSelection';
import { Results } from '../screens/Results';
import { Comparison } from '../screens/Comparison';
import { Settings } from '../screens/Settings';
import { History } from '../screens/History';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['merath://'],
  config: {
    screens: {
      EstateSetup: 'setup',
      Results: 'results',
    },
  },
};

export default function RootNavigator() {
  return (
    <CalcProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="EstateSetup" component={EstateSetup} />
          <Stack.Screen name="MadhabSelect" component={MadhabSelect} />
          <Stack.Screen name="HeirSelection" component={HeirSelection} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="Comparison" component={Comparison} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </CalcProvider>
  );
}
NAV

# ─────────────────────────────────────────────
# 4. Onboarding tooltip
# ─────────────────────────────────────────────
echo "💡 Adding onboarding tooltip..."
cat > components/OnboardingTooltip.tsx << 'TOOLTIP'
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';

export const OnboardingTooltip = () => {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('merath_tooltip_seen').then(val => {
      if (!val) setVisible(true);
    });
  }, []);

  const dismiss = () => {
    AsyncStorage.setItem('merath_tooltip_seen', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.tooltip, { backgroundColor: theme.colors.surface }]}>
        <Text style={theme.typography.body}>Tap the categories to add family members. Use the steppers to set their count.</Text>
        <TouchableOpacity onPress={dismiss} style={{ marginTop: 12, alignSelf: 'flex-end' }}>
          <Text style={{ color: theme.colors.primary }}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  tooltip: {
    padding: 24, margin: 40, borderRadius: 12, elevation: 5,
  },
});
TOOLTIP

# Add tooltip to HeirSelection screen
sed -i '1s/^/import { OnboardingTooltip } from "..\/components\/OnboardingTooltip";\n/' screens/HeirSelection.tsx 2>/dev/null || true
# Insert <OnboardingTooltip /> inside the main View (after the ScrollView or KeyboardAvoidingView)
perl -i -pe 's|</KeyboardAvoidingView>|</KeyboardAvoidingView>\n      <OnboardingTooltip />|' screens/HeirSelection.tsx 2>/dev/null || true

# ─────────────────────────────────────────────
# 5. Accessibility labels
# ─────────────────────────────────────────────
echo "♿ Adding accessibility labels..."
# Add accessibilityLabel to Button and Input (key components)
# We'll add a simple patch: replace "TouchableOpacity" with "TouchableOpacity accessibilityRole=\"button\""
# This is a rough, but we'll rewrite Button.tsx with accessibility props
cat > components/ui/Button.tsx << 'BTN'
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type Props = { title: string; onPress: () => void; mode?: 'filled' | 'outlined'; disabled?: boolean; style?: object };
export const Button: React.FC<Props> = ({ title, onPress, mode = 'filled', disabled, style }) => {
  const theme = useAppTheme();
  const bg = mode === 'filled' ? theme.colors.primary : 'transparent';
  const border = mode === 'outlined' ? theme.colors.primary : 'transparent';
  const color = mode === 'filled' ? theme.colors.onPrimary : theme.colors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[{ backgroundColor: bg, borderColor: border, borderWidth: 2, borderRadius: theme.radius.full, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg, alignItems: 'center', opacity: disabled ? 0.5 : 1 }, style]}>
      <Text style={[theme.typography.button, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};
BTN

# Also add accessibility to Input (not critical but good)
cat > components/ui/Input.tsx << 'INP'
import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
type Props = { label: string; value: string; onChangeText: (t: string) => void; keyboardType?: any; error?: string; helper?: string; leftIcon?: React.ReactNode; style?: object };
export const Input: React.FC<Props> = ({ label, value, onChangeText, keyboardType, error, helper, leftIcon, style }) => {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? theme.colors.error : focused ? theme.colors.primary : theme.colors.outline;
  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      <Text style={{ color: theme.colors.onSurface, marginBottom: 4 }} accessibilityRole="text">{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 12 }}>
        {leftIcon}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={{ flex: 1, paddingVertical: theme.spacing.sm, color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.outline}
        />
      </View>
      {error ? <Text style={{ color: theme.colors.error, fontSize: 12 }}>{error}</Text> : helper ? <Text style={{ color: theme.colors.outline, fontSize: 12 }}>{helper}</Text> : null}
    </View>
  );
};
INP

echo ""
echo "✅ All enhancements applied!"
echo "   Start: npx expo start"
echo "   Test: npm test"
echo "   Build: eas build -p android --profile production"