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
    require('expo-clipboard').setStringAsync(text); Alert.alert('Copied', 'Results copied to clipboard');
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
