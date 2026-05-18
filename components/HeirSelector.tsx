import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
  const counts = React.useMemo(() => {
    const map = new Map<HeirType, number>();
    heirs.forEach(h => map.set(h.type, h.count));
    return map;
  }, [heirs]);

  const toggleExpand = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const updateCount = useCallback((type: HeirType, delta: number) => {
    const current = counts.get(type) || 0;
    const newCount = Math.max(0, current + delta);

    // Spouse conflict validation
    if (type === 'husband' && newCount > 0 && (counts.get('wife') || 0) > 0) {
      Alert.alert('Validation', 'You cannot add a husband when a wife is already selected. Please remove the wife first.');
      return;
    }
    if (type === 'wife' && newCount > 0 && (counts.get('husband') || 0) > 0) {
      Alert.alert('Validation', 'You cannot add a wife when a husband is already selected. Please remove the husband first.');
      return;
    }

    // Max counts
    if (type === 'husband' && newCount > 1) {
      Alert.alert('Validation', 'Only one husband can be selected.');
      return;
    }
    if (type === 'wife' && newCount > 4) {
      Alert.alert('Validation', 'Maximum 4 wives can be selected.');
      return;
    }
    if (['father', 'mother', 'grandfather'].includes(type) && newCount > 1) {
      Alert.alert('Validation', `Only one ${HEIR_NAMES[type]} can be selected.`);
      return;
    }

    const newHeirs = heirs.filter(h => h.type !== type);
    if (newCount > 0) {
      newHeirs.push({ type, count: newCount });
    }
    onHeirsChange(newHeirs);
  }, [heirs, counts, onHeirsChange]);

  const blockedTypes = React.useMemo(() => {
    const activeHeirs = heirs.filter(h => h.count > 0);
    if (activeHeirs.length === 0) return new Set<HeirType>();
    const result = applyHijab(activeHeirs);
    const remainingTypes = new Set(result.map(h => h.type));
    // Blocked are those that are in activeHeirs but not in remaining
    const activeTypes = new Set(activeHeirs.map(h => h.type));
    return new Set([...activeTypes].filter(t => !remainingTypes.has(t)));
  }, [heirs]);

  return (
    <ScrollView>
      {CATEGORIES.map(cat => {
        const open = expanded.has(cat.title);
        return (
          <View key={cat.title} style={{ marginBottom: theme.spacing?.sm || 8 }}>
            <TouchableOpacity onPress={() => toggleExpand(cat.title)} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing?.sm || 8, backgroundColor: theme.colors?.surface || '#fff', borderRadius: theme.radius?.sm || 8, borderWidth: 1, borderColor: theme.colors?.outline || '#79747E' }}>
              <Text style={theme.typography?.h3 || { fontSize: 20, lineHeight: 28 }}>{cat.title}</Text>
              <Text>{open ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {open && cat.types.map(type => {
              const count = counts.get(type) || 0;
              const isBlocked = blockedTypes.has(type) && count === 0; // only show blocked if not already added
              return (
                <View key={type} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing?.md || 16, paddingVertical: theme.spacing?.xs || 4 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography?.body || { fontSize: 16 }}>{HEIR_NAMES[type]}</Text>
                    {isBlocked && <Text style={{ color: theme.colors?.error || '#BA1A1A', fontSize: 12 }}>⛔ Blocked</Text>}
                  </View>
                  {isBlocked ? (
                    <Text style={{ color: theme.colors?.error || '#BA1A1A', fontSize: 12 }}>—</Text>
                  ) : (
                    <Stepper
                      value={count}
                      onIncrease={() => updateCount(type, 1)}
                      onDecrease={() => updateCount(type, -1)}
                      min={0}
                      max={type === 'wife' ? 4 : type === 'husband' ? 1 : ['father', 'mother', 'grandfather'].includes(type) ? 1 : 20}
                    />
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};
