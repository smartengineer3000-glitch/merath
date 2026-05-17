import { OnboardingTooltip } from "../components/OnboardingTooltip";
import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { HeirSelector } from '../components/HeirSelector';
import { Button } from '../components/ui/Button';
import { useAppTheme } from '../hooks/useAppTheme';
import { useCalc } from '../lib/context/CalcContext';

export const HeirSelection = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { state, dispatch } = useCalc();

  const onNext = () => {
    dispatch({ type: 'SET_HEIRS', payload: state.heirs });
    navigation.navigate('Results');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md }}>
        <Text style={theme.typography.h1}>Select Heirs</Text>
        <HeirSelector heirs={state.heirs} onHeirsChange={(heirs) => dispatch({ type: 'SET_HEIRS', payload: heirs })} />
        <Button title="Calculate Inheritance" onPress={onNext} style={{ marginTop: theme.spacing.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
      <OnboardingTooltip />
  );
};
