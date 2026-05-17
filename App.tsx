import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { ThemeProvider } from './lib/context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import { ErrorBoundary } from './ErrorBoundary';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    // Enable RTL if Arabic is stored (simplified)
    AsyncStorage.getItem('lang').then(lang => {
      if (lang === 'ar') I18nManager.forceRTL(true);
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
