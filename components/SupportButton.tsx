import React from 'react';
import { TouchableOpacity, Text, Linking } from 'react-native';

export const SupportButton = () => (
  <TouchableOpacity onPress={() => Linking.openURL('https://merath.app/support')} style={{ padding: 12, backgroundColor: '#1B6B4A', borderRadius: 8, marginVertical: 8 }}>
    <Text style={{ color: 'white', textAlign: 'center' }}>💚 Support Us</Text>
  </TouchableOpacity>
);
