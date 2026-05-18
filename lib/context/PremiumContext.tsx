import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PremiumContext = createContext({ isPremium: false, togglePremium: () => {} });

export const PremiumProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('merath_premium').then(val => {
      if (val === 'true') setIsPremium(true);
    });
  }, []);

  const togglePremium = () => {
    const next = !isPremium;
    setIsPremium(next);
    AsyncStorage.setItem('merath_premium', next ? 'true' : 'false');
  };

  return (
    <PremiumContext.Provider value={{ isPremium, togglePremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => useContext(PremiumContext);
