import { create } from 'zustand';

export interface Emotions {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
}

interface EmotionHistory {
  timestamp: number;
  value: number;
}

interface Store {
  emotions: Emotions | null;
  setEmotions: (emotions: Emotions) => void;
  emotionHistory: EmotionHistory[];
  addToHistory: (value: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  emotions: null,
  setEmotions: (emotions) => set({ emotions }),
  emotionHistory: [],
  addToHistory: (value) => set((state) => ({
    emotionHistory: [
      ...state.emotionHistory,
      { timestamp: Date.now(), value }
    ].slice(-50) // Keep only last 50 points
  })),
  error: null,
  setError: (error) => set({ error })
})); 