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
