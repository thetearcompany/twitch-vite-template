import Dexie, { Table } from 'dexie';

export interface EmoteStats {
  emoteId: string;
  emoteName: string;
  count: number;
  url: string;
}

export interface EmotionRecord {
  id?: number;
  timestamp: number;
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
  negativeRatio: number;
  emotes: EmoteStats[];
  uniqueEmoteCount: number;
  totalEmoteCount: number;
  mostUsedEmote?: EmoteStats;
}

export class EmoscanDB extends Dexie {
  emotionHistory!: Table<EmotionRecord>;

  constructor() {
    super('emoscanDB');
    this.version(1).stores({
      emotionHistory: '++id, timestamp, negativeRatio, uniqueEmoteCount'
    });
  }
}

export const db = new EmoscanDB(); 