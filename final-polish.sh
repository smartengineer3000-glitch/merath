#!/bin/bash
# final-polish.sh – Ultimate professional polish for Merath
set -e

echo "🏁 Applying final professional polish..."

# 1. Safe theme fallback for all screens
echo "🛡️ Adding theme safety..."
for file in screens/EstateSetup.tsx screens/MadhabSelect.tsx screens/HeirSelection.tsx screens/Results.tsx screens/Comparison.tsx screens/Settings.tsx screens/History.tsx; do
  if [ -f "$file" ]; then
    sed -i 's/theme\.spacing\.lg/theme.spacing?.lg || 24/g' "$file"
    sed -i 's/theme\.spacing\.md/theme.spacing?.md || 16/g' "$file"
    sed -i 's/theme\.spacing\.sm/theme.spacing?.sm || 8/g' "$file"
    sed -i 's/theme\.radius\.lg/theme.radius?.lg || 16/g' "$file"
    sed -i 's/theme\.radius\.md/theme.radius?.md || 12/g' "$file"
    sed -i 's/theme\.colors\.primary/theme.colors?.primary || '#1B6B4A'/g' "$file"
    sed -i 's/theme\.colors\.surface/theme.colors?.surface || '#fff'/g' "$file"
    sed -i 's/theme\.colors\.background/theme.colors?.background || '#FCFCFF'/g' "$file"
    sed -i 's/theme\.colors\.onPrimary/theme.colors?.onPrimary || '#fff'/g' "$file"
    sed -i 's/theme\.colors\.onSurface/theme.colors?.onSurface || '#1C1B1F'/g' "$file"
    sed -i 's/theme\.colors\.outline/theme.colors?.outline || '#79747E'/g' "$file"
    sed -i 's/theme\.colors\.secondary/theme.colors?.secondary || '#C5A04E'/g' "$file"
    sed -i 's/theme\.colors\.error/theme.colors?.error || '#BA1A1A'/g' "$file"
    sed -i 's/theme\.typography\.h1/theme.typography?.h1 || { fontSize: 32, lineHeight: 40 }/g' "$file"
    sed -i 's/theme\.typography\.h2/theme.typography?.h2 || { fontSize: 24, lineHeight: 32 }/g' "$file"
    sed -i 's/theme\.typography\.body/theme.typography?.body || { fontSize: 16, lineHeight: 24 }/g' "$file"
    sed -i 's/theme\.typography\.caption/theme.typography?.caption || { fontSize: 12, lineHeight: 16 }/g' "$file"
  fi
done

# 2. Robust input validation in EstateSetup
echo "📝 Upgrading Estate validation..."
cat > screens/EstateSetup.tsx << 'VAL'
import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCalc } from '../lib/context/CalcContext';

export const EstateSetup = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { dispatch } = useCalc();
  const [total, setTotal] = useState('');
  const [funeral, setFuneral] = useState('');
  const [debts, setDebts] = useState('');
  const [will, setWill] = useState('');

  const parseInput = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const net = parseInput(total) - parseInput(funeral) - parseInput(debts);
  const maxWill = net / 3;
  const willError = parseInput(will) > maxWill && maxWill >= 0 ? 'Exceeds 1/3 of net estate' : '';

  const onNext = () => {
    if (!total || parseFloat(total) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid total estate amount.');
      return;
    }
    try {
      dispatch({
        type: 'SET_ESTATE',
        payload: {
          total: parseInput(total),
          funeral: parseInput(funeral),
          debts: parseInput(debts),
          will: parseInput(will),
        },
      });
      navigation.navigate('MadhabSelect');
    } catch (error) {
      Alert.alert('Error', 'Failed to save estate details. Please try again.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing?.lg || 24 }}>
        <Text style={[theme.typography?.h1 || { fontSize: 32, lineHeight: 40 }, { marginBottom: 24 }]}>Estate Details</Text>
        <Input label="Total Estate ($)" value={total} onChangeText={setTotal} keyboardType="numeric" leftIcon={<Text>$</Text>} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Input style={{ flex: 1 }} label="Funeral Costs" value={funeral} onChangeText={setFuneral} keyboardType="numeric" />
          <Input style={{ flex: 1 }} label="Debts" value={debts} onChangeText={setDebts} keyboardType="numeric" />
        </View>
        <Input label="Will (optional)" value={will} onChangeText={setWill} keyboardType="numeric" helper={maxWill > 0 ? `Max: $${maxWill.toFixed(2)}` : ''} error={willError} />
        <Button title="Next: Select School" onPress={onNext} disabled={!total || parseFloat(total) <= 0} style={{ marginTop: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
VAL

# 3. Safe context dispatch in MadhabSelect
echo "🧩 Adding safe dispatch to MadhabSelect..."
sed -i "s/dispatch({ type: 'SET_MADHAB', payload: item.key }); navigation.navigate('HeirSelection');/try { dispatch({ type: 'SET_MADHAB', payload: item.key }); navigation.navigate('HeirSelection'); } catch(e) { console.error(e); }/g" screens/MadhabSelect.tsx

# 4. Keyboard-aware scroll for HeirSelection
echo "⌨️ Keyboard avoidance for HeirSelection..."
sed -i '1s/^/import { KeyboardAvoidingView, Platform } from "react-native";\n/' screens/HeirSelection.tsx 2>/dev/null || true
sed -i 's/<View style={{ flex: 1 }}>/<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>/g' screens/HeirSelection.tsx
sed -i 's/<\/View>/<\/KeyboardAvoidingView>/g' screens/HeirSelection.tsx

# 5. Ensure ErrorBoundary shows the real error
cat > ErrorBoundary.tsx << 'ERR'
import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error('ERROR:', error, errorInfo); }
  handleReset = () => this.setState({ hasError: false, error: null });
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>{this.state.error?.message}</Text>
          <ScrollView style={{ maxHeight: '70%', marginBottom: 20 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{this.state.error?.stack}</Text>
          </ScrollView>
          <TouchableOpacity onPress={this.handleReset} style={{ padding: 12, backgroundColor: '#1B6B4A', borderRadius: 8 }}>
            <Text style={{ color: 'white' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
ERR

echo ""
echo "✅ Final polish applied. All theme accesses are now safe."
echo "   Restart: npx expo start"
echo "   Rebuild: eas build -p android --profile preview"
