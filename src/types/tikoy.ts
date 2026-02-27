import { Timestamp } from 'firebase/firestore';

export type ZodiacSign =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

export type TikoyStatus = 'active' | 'passed' | 'expired';

export interface Tikoy {
  id: string;
  chainId: string;

  currentHolderId: string;
  status: TikoyStatus;

  receivedAt: Timestamp;
  expiresAt: Timestamp;
  passedAt?: Timestamp;

  message: {
    templateId: string;
    recipientZodiac?: ZodiacSign;
    personalNote?: string;
    hokkienPhrase: string;
    selectedStickers: string[];
  };

  previousHolderId?: string;
  nextHolderId?: string;
  createdAt: Timestamp;
}

export interface CreateTikoyData {
  recipientEmail: string;
  messageTemplateId?: string;
  message?: string;
  personalNote?: string;
  recipientZodiac?: ZodiacSign;
  selectedStickers?: string[];
}

export interface PassTikoyData {
  tikoyId: string;
  recipientEmail: string;
  messageTemplateId?: string;
  message?: string;
  personalNote?: string;
  selectedStickers?: string[];
}
