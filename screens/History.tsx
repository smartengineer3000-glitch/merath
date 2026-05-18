import { t } from '../lib/i18n';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { getAuditTrail, AuditEntry } from '../lib/services/AuditTrailService';
import { useAppTheme } from '../hooks/useAppTheme';

export const History = ({ navigation }: any) => {
  const theme = useAppTheme();
  const [trail, setTrail] = useState<AuditEntry[]>([]);
  const [filtered, setFiltered] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAuditTrail().then(setTrail).then(() => setFiltered(trail));
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = trail.filter(entry =>
      entry.madhab.includes(text) ||
      entry.shares.some(s => s.name.includes(text)) ||
      entry.timestamp.includes(text)
    );
    setFiltered(filtered);
  };

  return (
    <View style={{ flex: 1, padding: theme.spacing?.lg || 24 }}>
      <Text style={theme.typography?.h1 || { fontSize: 32, lineHeight: 40 }}>Audit Trail</Text>
      <TextInput
        style={{ padding: 12, borderWidth: 1, borderColor: theme.colors?.outline || '#79747E', borderRadius: 8, marginVertical: 12 }}
        placeholder="Search by madhab, heir name, or date..."
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {filtered.length === 0 ? (
          <Text style={theme.typography?.body || { fontSize: 16 }}>No audit entries found.</Text>
        ) : (
          filtered.map((entry, idx) => (
            <TouchableOpacity key={idx} style={{ backgroundColor: theme.colors?.surface || '#fff', padding: 12, marginBottom: 8, borderRadius: 8 }}>
              <Text style={{ fontWeight: '600' }}>{new Date(entry.timestamp).toLocaleString()}</Text>
              <Text>Madhab: {entry.madhab}</Text>
              <Text>Net Estate: ${entry.netTotal}</Text>
              <Text style={{ marginTop: 8, fontWeight: '600' }}>Calculation Steps:</Text>
              {entry.steps.map((step, i) => (
                <Text key={i} style={{ fontSize: 12, marginLeft: 8 }}>• {step.title}: {step.description}</Text>
              ))}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};
