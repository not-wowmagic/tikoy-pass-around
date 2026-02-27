import { Timestamp } from 'firebase/firestore';
import { ZodiacSign } from './tikoy';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  zodiacSign?: ZodiacSign;
  city?: string;
  createdAt: Timestamp;

  stats: {
    tikoysReceived: number;
    tikoysSent: number;
    tikoysPassedOn: number;
    longestChain: number;
    activeTikoyId?: string;
  };
}

export interface CreateUserData {
  email: string;
  displayName: string;
  photoURL?: string;
  zodiacSign?: ZodiacSign;
  city?: string;
}
