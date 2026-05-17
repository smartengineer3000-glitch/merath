import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';
import * as MailComposer from 'expo-mail-composer';

export const FeedbackButton = () => {
  const handlePress = async () => {
    const can = await StoreReview.hasAction();
    if (can) {
      StoreReview.requestReview();
    } else {
      Alert.alert('Feedback', 'Would you like to send us an email?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => MailComposer.composeAsync({ recipients: ['support@merath.app'], subject: 'Merath Feedback' }) },
      ]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ padding: 12, backgroundColor: '#C5A04E', borderRadius: 8, marginVertical: 8 }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>⭐ Rate Us / Send Feedback</Text>
    </TouchableOpacity>
  );
};
