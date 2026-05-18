import AsyncStorage from '@react-native-async-storage/async-storage';

export async function incrementCalculationCount() {
  const stored = await AsyncStorage.getItem('merath_calc_count');
  const count = (stored ? parseInt(stored, 10) : 0) + 1;
  await AsyncStorage.setItem('merath_calc_count', count.toString());
  return count;
}

export async function getCalculationCount(): Promise<number> {
  const stored = await AsyncStorage.getItem('merath_calc_count');
  return stored ? parseInt(stored, 10) : 0;
}
