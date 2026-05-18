import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCalc } from '../lib/context/CalcContext';
import { calculateInheritance } from '../lib/engine/calculator';
import { MADHAB_NAMES, MADHAB_COLORS } from '../lib/engine/constants';
import { Madhab } from '../lib/engine/types';
import { useAppTheme } from '../hooks/useAppTheme';
import { FIQH_NOTES } from '../lib/services/FiqhReferences';
import { Button } from '../components/ui/Button';

const TABS: Madhab[] = ['hanafi', 'maliki', 'shafii', 'hanbali'];

export const Comparison = () => {
  const { state } = useCalc();
  const theme = useAppTheme();
  const [selected, setSelected] = useState<Madhab>('hanafi');
  const [results, setResults] = useState<any[]>([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const estate = { total: state.total, funeral: state.funeral, debts: state.debts, will: state.will };
    const all = TABS.map(m => calculateInheritance(m, estate, state.heirs));
    setResults(all);
  }, []);

  const notes = FIQH_NOTES[selected] || {};

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing?.lg || 24 }}>
      <Text style={theme.typography?.h1}>Madhab Comparison</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
        {TABS.map(m => (
          <TouchableOpacity key={m} onPress={() => setSelected(m)} style={{
            paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
            backgroundColor: selected === m ? MADHAB_COLORS[m] : theme.colors?.surfaceVariant || '#F0F0F3',
          }}>
            <Text style={{ color: selected === m ? '#fff' : theme.colors?.onSurface || '#1C1B1F' }}>{MADHAB_NAMES[m]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {results.filter(r => r).map((res, idx) => (
        res && selected === TABS[idx] ? (
          <View key={idx} style={{ padding: 16, marginBottom: 16, backgroundColor: theme.colors?.surface || '#fff', borderRadius: 12 }}>
            <Text style={theme.typography?.h2}>{MADHAB_NAMES[TABS[idx]]}</Text>
            <Text style={theme.typography?.body}>Net Estate: ${res.netEstate || res.netTotal}</Text>
            {res.shares.map((share: any, i: number) => (
              <Text key={i} style={theme.typography?.caption || { fontSize: 12, lineHeight: 16 }}>{share.name}: ${share.amount.toFixed(2)} ({share.fraction.numerator}/{share.fraction.denominator})</Text>
            ))}
          </View>
        ) : null
      ))}
      <Button title={showNotes ? "Hide Fiqh Notes" : "Show Fiqh Notes"} onPress={() => setShowNotes(!showNotes)} mode="outlined" />
      {showNotes && (
        <View style={{ padding: 12, marginTop: 8, backgroundColor: theme.colors?.surfaceVariant || '#F0F0F3', borderRadius: 8 }}>
          {Object.entries(notes).map(([key, val]) => (
            <Text key={key} style={{ fontSize: 12, marginBottom: 4 }}>• {val}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};
