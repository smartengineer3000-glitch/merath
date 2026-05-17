import { SupportButton } from '../components/SupportButton';
import { FeedbackButton } from '../components/FeedbackButton';
import { t } from '../lib/i18n';
import React from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { useTheme } from '../lib/context/ThemeContext';
import { useAppTheme } from '../hooks/useAppTheme';

export const Settings = ({ navigation }: any) => {
  const { isDark, toggleTheme } = useTheme();
  const theme = useAppTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={theme.typography.h1}>Settings</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 }}>
        <Text style={theme.typography.body}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
      <Text style={theme.typography.h2}>About</Text>
      <Text style={theme.typography.body}>Merath v1.0 – Islamic Inheritance Calculator</Text>
      <Text style={theme.typography.caption}>Built with Expo & TypeScript</Text>
      <FeedbackButton />
      <SupportButton />
    </ScrollView>
  );
};
