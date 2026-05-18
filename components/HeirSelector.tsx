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

const TEMPLATES: { name: string; heirs: { type: HeirType; count: number }[] }[] = [
  { name: 'Husband, Wife, 2 Sons, 1 Daughter', heirs: [{ type: 'husband', count: 1 }, { type: 'wife', count: 1 }, { type: 'son', count: 2 }, { type: 'daughter', count: 1 }] },
  { name: 'Father, Mother, Son, Daughter', heirs: [{ type: 'father', count: 1 }, { type: 'mother', count: 1 }, { type: 'son', count: 1 }, { type: 'daughter', count: 1 }] },
  { name: 'Wife, 3 Daughters', heirs: [{ type: 'wife', count: 1 }, { type: 'daughter', count: 3 }] },
  { name: 'Husband, 2 Sons', heirs: [{ type: 'husband', count: 1 }, { type: 'son', count: 2 }] },
  { name: 'Full Brothers (5)', heirs: [{ type: 'full_brother', count: 5 }] },
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

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    Alert.alert('Apply Template', `Replace current heirs with "${template.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Apply', onPress: () => onHeirsChange(template.heirs) },
    ]);
  };

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
    if (type === 'husband' && newCount > 0 && (counts.get('wife') || 0) > 0) {
      Alert.alert('Validation', 'Cannot add husband while wife exists.');
      return;
    }
    if (type === 'wife' && newCount > 0 && (counts.get('husband') || 0) > 0) {
      Alert.alert('Validation', 'Cannot add wife while husband exists.');
      return;
    }
    if (['husband'].includes(type) && newCount > 1) {
      Alert.alert('Validation', 'Only one husband allowed.');
      return;
    }
    if (type === 'wife' && newCount > 4) {
      Alert.alert('Validation', 'Maximum 4 wives.');
      return;
    }
    if (['father', 'mother', 'grandfather'].includes(type) && newCount > 1) {
      Alert.alert('Validation', `Only one ${HEIR_NAMES[type]} allowed.`);
      return;
    }
    const newHeirs = heirs.filter(h => h.type !== type);
    if (newCount > 0) newHeirs.push({ type, count: newCount });
    onHeirsChange(newHeirs);
  }, [heirs, counts, onHeirsChange]);

  const blockedTypes = React.useMemo(() => {
    const active = heirs.filter(h => h.count > 0);
    if (active.length === 0) return new Set<HeirType>();
    const result = applyHijab(active);
    const remaining = new Set(result.map(h => h.type));
    const activeTypes = new Set(active.map(h => h.type));
    return new Set([...activeTypes].filter(t => !remaining.has(t)));
  }, [heirs]);

  return (
    <ScrollView>
      {/* Quick Templates */}
      <View style={{ marginBottom: 16 }}>
        <Text style={[theme.typography?.h3, { marginBottom: 8 }]}>Quick Start Templates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TEMPLATES.map((tmpl, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => applyTemplate(tmpl)}
              style={{
                padding: 12,
                backgroundColor: theme.colors?.primaryLight || '#D4F1E8',
                borderRadius: 12,
                marginRight: 8,
                borderWidth: 1,
                borderColor: theme.colors?.primary || '#0D7C66',
              }}
            >
              <Text style={{ fontWeight: '600', color: theme.colors?.primary }}>{tmpl.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Heir Categories */}
      {CATEGORIES.map(cat => {
        const open = expanded.has(cat.title);
        return (
          <View key={cat.title} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => toggleExpand(cat.title)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 12,
                backgroundColor: theme.colors?.surface || '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors?.outline || '#A49E93',
              }}
            >
              <Text style={theme.typography?.h3}>{cat.title}</Text>
              <Text style={{ fontSize: 18 }}>{open ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {open && cat.types.map(type => {
              const count = counts.get(type) || 0;
              const isBlocked = blockedTypes.has(type) && count === 0;
              return (
                <View key={type} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography?.body}>{HEIR_NAMES[type]}</Text>
                    {isBlocked && <Text style={{ color: theme.colors?.error, fontSize: 12 }}>⛔ Blocked</Text>}
                  </View>
                  {isBlocked ? (
                    <Text style={{ color: theme.colors?.error, fontSize: 12 }}>—</Text>
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
