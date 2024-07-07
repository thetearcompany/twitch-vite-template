import { create } from "zustand";
import { db } from "@/lib/db";
import type { EmotionRecord, EmoteStats } from "@/lib/db";

interface EmotionStats {
  averageNegative: number;
  maxNegative: number;
  totalMessages: number;
  dominantEmotion: string;
  uniqueEmotes: number;
  totalEmotes: number;
  topEmotes: EmoteStats[];
}

interface Store {
  // Stan
  emotionHistory: EmotionRecord[];
  currentEmotions: EmotionRecord | null;
  stats: EmotionStats;
  isLoading: boolean;
  error: string | null;

  // Akcje
  analyzeChat: (messages: string[]) => Promise<void>;
  loadHistory: (limit?: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  getStats: () => Promise<void>;
  exportData: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  // Stan początkowy
  emotionHistory: [],
  currentEmotions: null,
  stats: {
    averageNegative: 0,
    maxNegative: 0,
    totalMessages: 0,
    dominantEmotion: 'neutral',
    uniqueEmotes: 0,
    totalEmotes: 0,
    topEmotes: []
  },
  isLoading: false,
  error: null,

  // Analiza chatu
  analyzeChat: async (messages: string[]) => {
    try {
      set({ isLoading: true, error: null });
      
      const emotions = {
        happy: 0,
        sad: 0,
        angry: 0,
        surprised: 0,
        neutral: 0,
      };

      // Mapa do śledzenia emotek
      const emoteMap = new Map<string, EmoteStats>();

      messages.forEach((msg) => {
        // Analiza emotek Twitch
        const emoteMatches = msg.match(/(?<=^|\s)([A-Za-z0-9][A-Za-z0-9]+)(?=$|\s)/g) || [];
        emoteMatches.forEach(emoteName => {
          const emote = emoteMap.get(emoteName);
          if (emote) {
            emote.count++;
          } else {
            emoteMap.set(emoteName, {
              emoteId: emoteName,
              emoteName: emoteName,
              count: 1,
              url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteName}/default/dark/3.0`
            });
          }
        });

        // Analiza emocji
        if (msg.includes(":)") || msg.includes("😂") || msg.includes("😃")) {
          emotions.happy++;
        } else if (msg.includes(":(") || msg.includes("😢") || msg.includes("😭")) {
          emotions.sad++;
        } else if (msg.includes("😡") || msg.includes("👿")) {
          emotions.angry++;
        } else if (msg.includes("😲") || msg.includes("😯")) {
          emotions.surprised++;
        } else {
          emotions.neutral++;
        }
      });

      const totalEmotions = Object.values(emotions).reduce((a, b) => a + b, 0);
      const negativeRatio = totalEmotions > 0 ? 
        (emotions.sad + emotions.angry) / totalEmotions : 0;

      // Sortowanie emotek po liczbie wystąpień
      const sortedEmotes = Array.from(emoteMap.values())
        .sort((a, b) => b.count - a.count);

      const record: EmotionRecord = {
        timestamp: Date.now(),
        ...emotions,
        negativeRatio,
        emotes: sortedEmotes,
        uniqueEmoteCount: emoteMap.size,
        totalEmoteCount: sortedEmotes.reduce((sum, emote) => sum + emote.count, 0),
        mostUsedEmote: sortedEmotes[0]
      };

      await db.emotionHistory.add(record);
      set({ currentEmotions: record });
      await get().loadHistory();
      await get().getStats();

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Ładowanie historii
  loadHistory: async (limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const history = await db.emotionHistory
        .orderBy('timestamp')
        .reverse()
        .limit(limit)
        .toArray();
      set({ emotionHistory: history.reverse() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Czyszczenie historii
  clearHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      await db.emotionHistory.clear();
      set({ 
        emotionHistory: [],
        currentEmotions: null,
        stats: {
          averageNegative: 0,
          maxNegative: 0,
          totalMessages: 0,
          dominantEmotion: 'neutral',
          uniqueEmotes: 0,
          totalEmotes: 0,
          topEmotes: []
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Obliczanie statystyk
  getStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const allRecords = await db.emotionHistory.toArray();
      
      if (allRecords.length === 0) {
        return;
      }

      const negativeRatios = allRecords.map(r => r.negativeRatio);
      const averageNegative = negativeRatios.reduce((a, b) => a + b, 0) / negativeRatios.length;
      const maxNegative = Math.max(...negativeRatios);
      
      const totalMessages = allRecords.reduce((sum, record) => 
        sum + record.happy + record.sad + record.angry + record.surprised + record.neutral, 0
      );

      // Agregacja emotek ze wszystkich rekordów
      const globalEmoteMap = new Map<string, EmoteStats>();
      allRecords.forEach(record => {
        record.emotes.forEach(emote => {
          const existing = globalEmoteMap.get(emote.emoteId);
          if (existing) {
            existing.count += emote.count;
          } else {
            globalEmoteMap.set(emote.emoteId, { ...emote });
          }
        });
      });

      const topEmotes = Array.from(globalEmoteMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const emotionSums = allRecords.reduce((sums, record) => {
        sums.happy += record.happy;
        sums.sad += record.sad;
        sums.angry += record.angry;
        sums.surprised += record.surprised;
        sums.neutral += record.neutral;
        return sums;
      }, { happy: 0, sad: 0, angry: 0, surprised: 0, neutral: 0 });

      const dominantEmotion = Object.entries(emotionSums)
      .reduce((max, [emotion, count]) => 
        (count as number) > max.count ? { emotion, count: count as number } : max, 
        { emotion: 'neutral', count: -1 }
      ).emotion;

      set({
        stats: {
          averageNegative,
          maxNegative,
          totalMessages,
          dominantEmotion,
          uniqueEmotes: globalEmoteMap.size,
          totalEmotes: Array.from(globalEmoteMap.values()).reduce((sum, emote) => sum + emote.count, 0),
          topEmotes
        }
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Eksport danych
  exportData: async () => {
    try {
      set({ isLoading: true, error: null });
      const allData = await db.emotionHistory.toArray();
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  }
}));