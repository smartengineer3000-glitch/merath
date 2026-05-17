import { t } from '../lib/i18n';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';

export const History = ({ navigation }: any) => {
  const theme = useAppTheme();
  const [history, setHistory] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('merath_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        setFiltered(parsed);
      }
    };
    load();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = history.filter(entry => {
      const matchDate = entry.date?.includes(text);
      const matchMadhab = entry.madhab?.includes(text);
      const matchShares = entry.shares?.some((s: any) => s.name.includes(text));
      return matchDate || matchMadhab || matchShares;
    });
    setFiltered(filtered);
  };

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg }}>
      <Text style={theme.typography.h1}>Recent Calculations</Text>
      <TextInput
        style={{ padding: 12, borderWidth: 1, borderColor: theme.colors.outline, borderRadius: 8, marginVertical: 12 }}
        placeholder="Search by date, madhab or name..."
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {filtered.length === 0 ? (
          <Text style={theme.typography.body}>No calculations found.</Text>
        ) : (
          filtered.map((entry, idx) => (
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
    </View>
  );
};
