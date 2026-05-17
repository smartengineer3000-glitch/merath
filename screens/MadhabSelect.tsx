import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCalc } from '../lib/context/CalcContext';
import { Madhab } from '../lib/engine/types';

const madhabs: { key: Madhab; title: string; desc: string; icon: string }[] = [
  { key: 'hanafi', title: 'Hanafi', desc: 'Most widespread school', icon: '📖' },
  { key: 'maliki', title: 'Maliki', desc: 'Official school of Morocco', icon: '⚖️' },
  { key: 'shafii', title: 'Shafi\'i', desc: 'Predominant in Southeast Asia', icon: '🕌' },
  { key: 'hanbali', title: 'Hanbali', desc: 'Official school of Saudi Arabia', icon: '📜' },
];

export const MadhabSelect = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { dispatch } = useCalc();

  return (
    <FlatList contentContainerStyle={{ padding: theme.spacing.lg }} data={madhabs} keyExtractor={i => i.key} renderItem={({ item }) => (
      <TouchableOpacity onPress={() => { dispatch({ type: 'SET_MADHAB', payload: item.key }); navigation.navigate('HeirSelection'); }} style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderLeftWidth: 6, borderLeftColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginRight: 12 }}>{item.icon}</Text>
        <View>
          <Text style={theme.typography.h2}>{item.title}</Text>
          <Text style={theme.typography.body}>{item.desc}</Text>
        </View>
      </TouchableOpacity>
    )} />
  );
};
