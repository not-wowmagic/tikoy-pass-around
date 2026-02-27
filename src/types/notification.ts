import { Timestamp } from 'firebase/firestore';

export type NotificationType =
  | 'tikoy_received'
  | 'reminder_12hr'
  | 'reminder_1hr'
  | 'tikoy_expired';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;

  tikoyId: string;
  chainId: string;

  title: string;
  message: string;

  read: boolean;
  sentAt: Timestamp;
  expiresAt?: Timestamp;
}
