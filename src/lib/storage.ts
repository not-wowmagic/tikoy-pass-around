import { v4 as uuidv4 } from 'uuid';

export interface TikoyData {
  id: string;
  senderName: string;
  message: string;
  chainId: string;
  previousTikoyId?: string;
  passCount: number;
  createdAt: number;
  expiresAt: number;
  status: 'active' | 'passed' | 'expired';
}

async function firestoreSet(id: string, data: TikoyData): Promise<void> {
  const { firestore } = await import('./firebase/config');
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(firestore, 'tikoys', id), data);
}

async function firestoreGet(id: string): Promise<TikoyData | null> {
  const { firestore } = await import('./firebase/config');
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(firestore, 'tikoys', id));
  return snap.exists() ? (snap.data() as TikoyData) : null;
}

async function firestoreUpdate(id: string, fields: Partial<TikoyData>): Promise<void> {
  const { firestore } = await import('./firebase/config');
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(firestore, 'tikoys', id), fields as Record<string, unknown>);
}

export async function createTikoy(
  senderName: string,
  message: string,
  previousTikoy?: TikoyData
): Promise<TikoyData> {
  const now = Date.now();
  const tikoy: TikoyData = {
    id: uuidv4(),
    senderName,
    message,
    chainId: previousTikoy?.chainId ?? uuidv4(),
    previousTikoyId: previousTikoy?.id,
    passCount: previousTikoy ? previousTikoy.passCount + 1 : 0,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
    status: 'active',
  };

  await firestoreSet(tikoy.id, tikoy);

  if (previousTikoy) {
    await markPassed(previousTikoy.id);
  }

  return tikoy;
}

export async function getTikoy(id: string): Promise<TikoyData | null> {
  return firestoreGet(id);
}

export async function markPassed(id: string): Promise<void> {
  await firestoreUpdate(id, { status: 'passed' });
}
