import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';

export const History = ({ navigation }: any) => {
  const theme = useAppTheme();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('merath_history');
      if (stored) setHistory(JSON.parse(stored));
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={theme.typography.h1}>Recent Calculations</Text>
      {history.length === 0 ? (
        <Text style={theme.typography.body}>No recent calculations.</Text>
      ) : (
        history.map((entry, idx) => (
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
  );
};
