import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuditEntry {
  id: string;
  timestamp: string;
  madhab: string;
  netTotal: number;
  shares: any[];
  steps: { title: string; description: string }[];
  hijabLog?: string[];
}

const STORAGE_KEY = 'merath_audit_trail';

export async function saveAuditTrail(entry: AuditEntry) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const trail: AuditEntry[] = stored ? JSON.parse(stored) : [];
  trail.unshift(entry);
  if (trail.length > 50) trail.pop();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trail));
}

export async function getAuditTrail(): Promise<AuditEntry[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function clearAuditTrail() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
