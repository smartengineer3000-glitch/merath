import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
type Props = { value: number; onIncrease: () => void; onDecrease: () => void; min?: number; max?: number };
export const Stepper: React.FC<Props> = ({ value, onIncrease, onDecrease, min = 0, max = 99 }) => {
  const theme = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={onDecrease} disabled={value <= min} style={{ width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, opacity: value <= min ? 0.4 : 1 }}>
        <Text style={{ fontSize: 18 }}>−</Text>
      </TouchableOpacity>
      <Text style={{ marginHorizontal: 12, fontSize: 18, fontWeight: '600' }}>{value}</Text>
      <TouchableOpacity onPress={onIncrease} disabled={value >= max} style={{ width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primaryLight }}>
        <Text style={{ fontSize: 18, color: theme.colors.primary }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
