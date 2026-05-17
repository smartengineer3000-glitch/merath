import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
export const Card: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => {
  const theme = useAppTheme();
  return <View style={[{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md }, style]}>{children}</View>;
};
