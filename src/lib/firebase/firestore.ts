import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from './config';
import { User, CreateUserData } from '@/types/user';

// Helper to assert Firestore is initialized
function getDb() {
  if (!firestore) throw new Error('Firebase is not configured.');
  return firestore;
}
import { Tikoy, CreateTikoyData, PassTikoyData, TikoyStatus } from '@/types/tikoy';
import { Chain, ChainLink, ChainStatus } from '@/types/chain';
import { Notification } from '@/types/notification';

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Create a new user document in Firestore
 */
export async function createUser(
  uid: string,
  data: CreateUserData
): Promise<void> {
  const userRef = doc(getDb(), 'users', uid);
  const userData: User = {
    uid,
    email: data.email,
    displayName: data.displayName,
    zodiacSign: data.zodiacSign,
    city: data.city,
    stats: {
      tikoysReceived: 0,
      tikoysSent: 0,
      tikoysPassedOn: 0,
      longestChain: 0,
    },
    createdAt: Timestamp.now(),
  };

  await setDoc(userRef, userData);
}

/**
 * Get a user by UID
 */
export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(getDb(), 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as User;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const usersRef = collection(getDb(), 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs[0].data() as User;
}

/**
 * Update user stats
 */
export async function updateUserStats(
  uid: string,
  updates: Partial<User['stats']>
): Promise<void> {
  const userRef = doc(getDb(), 'users', uid);
  await updateDoc(userRef, { 'stats': updates });
}

// ============================================================================
// TIKOY OPERATIONS
// ============================================================================

/**
 * Create a new Tikoy
 */
export async function createTikoy(
  senderId: string,
  data: CreateTikoyData
): Promise<string> {
  // Find recipient by email
  const recipient = await getUserByEmail(data.recipientEmail);
  if (!recipient) {
    throw new Error('Recipient not found');
  }

  // Check if sender is creating first Tikoy or passing one
  const sender = await getUser(senderId);
  if (!sender) {
    throw new Error('Sender not found');
  }

  // Create new chain for first Tikoy
  const chainId = await createChain(senderId, sender.displayName);

  // Create Tikoy document
  const tikoyRef = doc(collection(getDb(), 'tikoys'));
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000); // 24 hours

  const tikoy: Tikoy = {
    id: tikoyRef.id,
    chainId,
    currentHolderId: recipient.uid,
    status: 'active',
    receivedAt: now,
    expiresAt,
    message: {
      templateId: data.messageTemplateId || 'custom',
      recipientZodiac: data.recipientZodiac,
      personalNote: data.message || data.personalNote, // Temporary for Milestone 1
      hokkienPhrase: 'Gong xi fa cai!', // Default for now
      selectedStickers: data.selectedStickers || [],
    },
    previousHolderId: senderId,
    createdAt: now,
  };

  await setDoc(tikoyRef, tikoy);

  // Add first link to chain
  await addChainLink(chainId, {
    holderId: senderId,
    holderName: sender.displayName,
    tikoyId: tikoyRef.id,
    receivedAt: now,
    passedAt: now,
    city: sender.city,
    action: 'created',
  });

  // Add second link for recipient
  await addChainLink(chainId, {
    holderId: recipient.uid,
    holderName: recipient.displayName,
    tikoyId: tikoyRef.id,
    receivedAt: now,
    city: recipient.city,
    action: 'passed',
  });

  // Update sender stats
  const senderRef = doc(getDb(), 'users', senderId);
  await updateDoc(senderRef, {
    'stats.tikoysSent': (sender.stats.tikoysSent || 0) + 1,
  });

  // Update recipient stats
  const recipientRef = doc(getDb(), 'users', recipient.uid);
  await updateDoc(recipientRef, {
    'stats.tikoysReceived': (recipient.stats.tikoysReceived || 0) + 1,
    'stats.activeTikoyId': tikoyRef.id,
  });

  return tikoyRef.id;
}

/**
 * Get a Tikoy by ID
 */
export async function getTikoy(tikoyId: string): Promise<Tikoy | null> {
  const tikoyRef = doc(getDb(), 'tikoys', tikoyId);
  const tikoySnap = await getDoc(tikoyRef);

  if (!tikoySnap.exists()) {
    return null;
  }

  return tikoySnap.data() as Tikoy;
}

/**
 * Pass a Tikoy to someone new
 */
export async function passTikoy(
  currentHolderId: string,
  data: PassTikoyData
): Promise<string> {
  // Get the current Tikoy
  const tikoy = await getTikoy(data.tikoyId);
  if (!tikoy) {
    throw new Error('Tikoy not found');
  }

  // Verify current holder
  if (tikoy.currentHolderId !== currentHolderId) {
    throw new Error('You are not the current holder of this Tikoy');
  }

  // Check if Tikoy is active
  if (tikoy.status !== 'active') {
    throw new Error('This Tikoy can no longer be passed');
  }

  // Find recipient by email
  const recipient = await getUserByEmail(data.recipientEmail);
  if (!recipient) {
    throw new Error('Recipient not found');
  }

  const currentHolder = await getUser(currentHolderId);
  if (!currentHolder) {
    throw new Error('Current holder not found');
  }

  // Update current Tikoy status
  const tikoyRef = doc(getDb(), 'tikoys', data.tikoyId);
  const now = Timestamp.now();
  await updateDoc(tikoyRef, {
    status: 'passed',
    passedAt: now,
    nextHolderId: recipient.uid,
  });

  // Create new Tikoy for recipient
  const newTikoyRef = doc(collection(getDb(), 'tikoys'));
  const expiresAt = Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000);

  const newTikoy: Tikoy = {
    id: newTikoyRef.id,
    chainId: tikoy.chainId,
    currentHolderId: recipient.uid,
    status: 'active',
    receivedAt: now,
    expiresAt,
    message: {
      templateId: data.messageTemplateId || 'custom',
      personalNote: data.message || data.personalNote,
      hokkienPhrase: 'Gong xi fa cai!',
      selectedStickers: data.selectedStickers || [],
    },
    previousHolderId: currentHolderId,
    createdAt: now,
  };

  await setDoc(newTikoyRef, newTikoy);

  // Add link to chain
  await addChainLink(tikoy.chainId, {
    holderId: recipient.uid,
    holderName: recipient.displayName,
    tikoyId: newTikoyRef.id,
    receivedAt: now,
    city: recipient.city,
    action: 'passed',
  });

  // Update chain pass time for current holder
  const chain = await getChain(tikoy.chainId);
  if (chain) {
    const lastLink = chain.journey[chain.journey.length - 1];
    if (lastLink.holderId === currentHolderId) {
      const chainRef = doc(getDb(), 'chains', tikoy.chainId);
      const updatedJourney = [...chain.journey];
      updatedJourney[updatedJourney.length - 1] = {
        ...lastLink,
        passedAt: now,
      };
      await updateDoc(chainRef, { journey: updatedJourney });
    }
  }

  // Update stats
  const currentHolderRef = doc(getDb(), 'users', currentHolderId);
  await updateDoc(currentHolderRef, {
    'stats.tikoysPassedOn': (currentHolder.stats.tikoysPassedOn || 0) + 1,
    'stats.activeTikoyId': null,
  });

  const recipientRef = doc(getDb(), 'users', recipient.uid);
  await updateDoc(recipientRef, {
    'stats.tikoysReceived': (recipient.stats.tikoysReceived || 0) + 1,
    'stats.activeTikoyId': newTikoyRef.id,
  });

  return newTikoyRef.id;
}

/**
 * Update Tikoy status
 */
export async function updateTikoyStatus(
  tikoyId: string,
  status: TikoyStatus
): Promise<void> {
  const tikoyRef = doc(getDb(), 'tikoys', tikoyId);
  await updateDoc(tikoyRef, { status });
}

// ============================================================================
// CHAIN OPERATIONS
// ============================================================================

/**
 * Create a new chain
 */
export async function createChain(
  originatorId: string,
  originatorName?: string
): Promise<string> {
  const chainRef = doc(collection(getDb(), 'chains'));
  const now = Timestamp.now();

  const chain: Chain = {
    id: chainRef.id,
    originatorId,
    status: 'active',
    totalPasses: 0,
    totalUniquePeople: 1,
    citiesVisited: [],
    journey: [],
    createdAt: now,
  };

  await setDoc(chainRef, chain);
  return chainRef.id;
}

/**
 * Get a chain by ID
 */
export async function getChain(chainId: string): Promise<Chain | null> {
  const chainRef = doc(getDb(), 'chains', chainId);
  const chainSnap = await getDoc(chainRef);

  if (!chainSnap.exists()) {
    return null;
  }

  return chainSnap.data() as Chain;
}

/**
 * Add a link to the chain
 */
export async function addChainLink(
  chainId: string,
  link: ChainLink
): Promise<void> {
  const chain = await getChain(chainId);
  if (!chain) {
    throw new Error('Chain not found');
  }

  const updatedJourney = [...chain.journey, link];
  const uniqueHolders = new Set(updatedJourney.map((l) => l.holderId));
  const uniqueCities = new Set(
    updatedJourney.map((l) => l.city).filter((city) => city !== undefined)
  );

  const chainRef = doc(getDb(), 'chains', chainId);
  await updateDoc(chainRef, {
    journey: updatedJourney,
    totalPasses: updatedJourney.length - 1, // Exclude originator
    totalUniquePeople: uniqueHolders.size,
    citiesVisited: Array.from(uniqueCities),
  });
}

/**
 * Update chain status
 */
export async function updateChainStatus(
  chainId: string,
  status: ChainStatus
): Promise<void> {
  const chainRef = doc(getDb(), 'chains', chainId);
  await updateDoc(chainRef, { status });
}

// ============================================================================
// NOTIFICATION OPERATIONS
// ============================================================================

/**
 * Create a notification
 */
export async function createNotification(
  data: Omit<Notification, 'id' | 'sentAt'>
): Promise<string> {
  const notificationRef = doc(collection(getDb(), 'notifications'));
  const notification: Notification = {
    ...data,
    id: notificationRef.id,
    sentAt: Timestamp.now(),
  };

  await setDoc(notificationRef, notification);
  return notificationRef.id;
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string
): Promise<Notification[]> {
  const notificationsRef = collection(getDb(), 'notifications');
  const q = query(notificationsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data() as Notification);
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const notificationRef = doc(getDb(), 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
}
