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
