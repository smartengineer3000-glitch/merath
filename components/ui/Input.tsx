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
