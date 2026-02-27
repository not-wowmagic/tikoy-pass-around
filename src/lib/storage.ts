import { v4 as uuidv4 } from 'uuid';

export interface TikoyData {
  id: string;
  senderName: string;
  message: string;
  chainId: string;
  previousTikoyId?: string;
  passCount: number;       // How many times this chain has been passed
  createdAt: number;       // Unix ms
  expiresAt: number;       // Unix ms (24hr from createdAt)
  status: 'active' | 'passed' | 'expired';
}

// ─── Firestore helpers (lazy-loaded so they don't crash without credentials) ───

async function firestoreSet(id: string, data: TikoyData): Promise<void> {
  const { firestore } = await import('./firebase/config');
  if (!firestore) throw new Error('no-firebase');
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(firestore, 'tikoys', id), data);
}

async function firestoreGet(id: string): Promise<TikoyData | null> {
  const { firestore } = await import('./firebase/config');
  if (!firestore) throw new Error('no-firebase');
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(firestore, 'tikoys', id));
  return snap.exists() ? (snap.data() as TikoyData) : null;
}

async function firestoreUpdate(id: string, fields: Partial<TikoyData>): Promise<void> {
  const { firestore } = await import('./firebase/config');
  if (!firestore) throw new Error('no-firebase');
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(firestore, 'tikoys', id), fields as Record<string, unknown>);
}

// ─── localStorage fallback ────────────────────────────────────────────────────

const LS_KEY = 'tikoy_store';

function lsAll(): Record<string, TikoyData> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

function lsSave(store: Record<string, TikoyData>) {
  localStorage.setItem(LS_KEY, JSON.stringify(store));
}

// ─── Public API ───────────────────────────────────────────────────────────────

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

  try {
    await firestoreSet(tikoy.id, tikoy);
  } catch {
    // Fallback to localStorage
    const store = lsAll();
    store[tikoy.id] = tikoy;
    lsSave(store);
  }

  // Mark previous tikoy as passed
  if (previousTikoy) {
    await markPassed(previousTikoy.id);
  }

  return tikoy;
}

export async function getTikoy(id: string): Promise<TikoyData | null> {
  try {
    return await firestoreGet(id);
  } catch {
    return lsAll()[id] ?? null;
  }
}

export async function markPassed(id: string): Promise<void> {
  try {
    await firestoreUpdate(id, { status: 'passed' });
  } catch {
    const store = lsAll();
    if (store[id]) { store[id].status = 'passed'; lsSave(store); }
  }
}
