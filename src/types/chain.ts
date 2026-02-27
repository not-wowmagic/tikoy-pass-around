import { Timestamp } from 'firebase/firestore';

export type ChainStatus = 'active' | 'broken' | 'complete';

export interface ChainLink {
  holderId: string;
  holderName?: string;
  tikoyId: string;
  receivedAt: Timestamp;
  passedAt?: Timestamp;
  city?: string;
  action: 'created' | 'passed' | 'expired';
}

export interface Chain {
  id: string;
  originatorId: string;
  status: ChainStatus;

  totalPasses: number;
  totalUniquePeople: number;
  citiesVisited: string[];

  journey: ChainLink[];
  createdAt: Timestamp;
}

export interface ChainStats {
  totalPasses: number;
  totalUniquePeople: number;
  citiesVisited: string[];
  averageTimePerPass?: number;
  longestHold?: number;
}
