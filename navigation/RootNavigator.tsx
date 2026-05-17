import React, { useEffect } from 'react';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalcProvider } from '../lib/context/CalcContext';
import { EstateSetup } from '../screens/EstateSetup';
import { MadhabSelect } from '../screens/MadhabSelect';
import { HeirSelection } from '../screens/HeirSelection';
import { Results } from '../screens/Results';
import { Comparison } from '../screens/Comparison';
import { Settings } from '../screens/Settings';
import { History } from '../screens/History';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['merath://'],
  config: {
    screens: {
      EstateSetup: 'setup',
      Results: 'results',
    },
  },
};

export default function RootNavigator() {
  return (
    <CalcProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="EstateSetup" component={EstateSetup} />
          <Stack.Screen name="MadhabSelect" component={MadhabSelect} />
          <Stack.Screen name="HeirSelection" component={HeirSelection} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="Comparison" component={Comparison} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </CalcProvider>
  );
}
