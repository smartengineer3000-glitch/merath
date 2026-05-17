import { t } from '../lib/i18n';
import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCalc } from '../lib/context/CalcContext';

export const EstateSetup = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { dispatch } = useCalc();
  const [total, setTotal] = useState('');
  const [funeral, setFuneral] = useState('');
  const [debts, setDebts] = useState('');
  const [will, setWill] = useState('');
  const net = parseFloat(total || '0') - parseFloat(funeral || '0') - parseFloat(debts || '0');
  const maxWill = net / 3;
  const willError = parseFloat(will) > maxWill && maxWill >= 0 ? 'Exceeds 1/3 of net estate' : '';

  const onNext = () => {
    dispatch({ type: 'SET_ESTATE', payload: { total: parseFloat(total) || 0, funeral: parseFloat(funeral) || 0, debts: parseFloat(debts) || 0, will: parseFloat(will) || 0 } });
    navigation.navigate('MadhabSelect');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={theme.typography.h1}>Estate Details</Text>
      <Input label="Total Estate ($)" value={total} onChangeText={setTotal} keyboardType="numeric" leftIcon={<Text>$</Text>} />
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <Input style={{ flex: 1 }} label="Funeral Costs" value={funeral} onChangeText={setFuneral} keyboardType="numeric" />
        <Input style={{ flex: 1 }} label="Debts" value={debts} onChangeText={setDebts} keyboardType="numeric" />
      </View>
      <Input label="Will (optional)" value={will} onChangeText={setWill} keyboardType="numeric" helper={maxWill > 0 ? `Max: $${maxWill.toFixed(2)}` : ''} error={willError} />
      <Button title="Next: Select School" onPress={onNext} disabled={!total || parseFloat(total) <= 0} style={{ marginTop: theme.spacing.lg }} />
    </ScrollView>
  );
};
