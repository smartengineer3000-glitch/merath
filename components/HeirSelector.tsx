import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { Stepper } from './ui/Stepper';
import { HeirType, HeirEntry } from '../lib/engine/types';
import { HEIR_NAMES } from '../lib/engine/constants';
import { applyHijab } from '../lib/engine/hijab';

const CATEGORIES: { title: string; types: HeirType[] }[] = [
  { title: 'Spouse', types: ['husband', 'wife'] },
  { title: 'Children', types: ['son', 'daughter', 'grandson', 'granddaughter'] },
  { title: 'Parents & Grandparents', types: ['father', 'mother', 'grandfather', 'grandmother_mother', 'grandmother_father'] },
  { title: 'Siblings', types: ['full_brother', 'full_sister', 'paternal_brother', 'paternal_sister', 'maternal_brother', 'maternal_sister'] },
  { title: 'Extended', types: ['full_nephew', 'paternal_nephew', 'full_uncle', 'paternal_uncle', 'maternal_uncle', 'paternal_aunt', 'maternal_aunt'] },
];

type Props = { heirs: HeirEntry[]; onHeirsChange: (heirs: HeirEntry[]) => void };

export const HeirSelector: React.FC<Props> = ({ heirs, onHeirsChange }) => {
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Spouse', 'Children']));
  const counts = new Map(heirs.map(h => [h.type, h.count]));

  const toggleExpand = (cat: string) => {
    setExpanded(prev => { const next = new Set(prev); if (next.has(cat)) next.delete(cat); else next.add(cat); return next; });
  };

  const updateCount = (type: HeirType, delta: number) => {
    const current = counts.get(type) || 0;
    const newCount = Math.max(0, current + delta);
    const newHeirs = heirs.filter(h => h.type !== type);
    if (newCount > 0) newHeirs.push({ type, count: newCount });
    onHeirsChange(newHeirs);
  };

  const blockedTypes = new Set(applyHijab(heirs.filter(h => h.count > 0)).map(h => h.type));

  return (
    <ScrollView>
      {CATEGORIES.map(cat => {
        const open = expanded.has(cat.title);
        return (
          <View key={cat.title} style={{ marginBottom: theme.spacing.sm }}>
            <TouchableOpacity onPress={() => toggleExpand(cat.title)} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing.sm, backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.outline }}>
              <Text style={theme.typography.h3}>{cat.title}</Text>
              <Text>{open ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {open && cat.types.map(type => {
              const count = counts.get(type) || 0;
              const blocked = blockedTypes.has(type);
              return (
                <View key={type} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs }}>
                  <View>
                    <Text style={theme.typography.body}>{HEIR_NAMES[type]}</Text>
                    {blocked && <Text style={{ color: theme.colors.error, fontSize: 12 }}>⛔ Blocked</Text>}
                  </View>
                  {!blocked && <Stepper value={count} onIncrease={() => updateCount(type, 1)} onDecrease={() => updateCount(type, -1)} min={0} max={type === 'wife' ? 4 : type === 'husband' ? 1 : 20} />}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};
