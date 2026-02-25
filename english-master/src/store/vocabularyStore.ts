import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface VocabularyItem {
  id: string;
  englishText: string;
  chunking: string;
  audioUrl?: string;
  createdAt: number;
}

export type VocabularyRow = {
  id: string;
  english_text: string;
  chunking: string;
  audio_url: string | null;
  created_at: string;
};

export const VOCABULARY_TABLE = 'vocabulary' as const;

function rowToItem(row: VocabularyRow): VocabularyItem {
  return {
    id: row.id,
    englishText: row.english_text,
    chunking: row.chunking,
    audioUrl: row.audio_url ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function itemToRow(item: Omit<VocabularyItem, 'id' | 'createdAt'>): Omit<VocabularyRow, 'id' | 'created_at'> {
  return {
    english_text: item.englishText,
    chunking: item.chunking,
    audio_url: item.audioUrl ?? null,
  };
}

export type VocabularyLoadError = string | null;

interface VocabularyState {
  items: VocabularyItem[];
  loading: boolean;
  error: VocabularyLoadError;
  /** 앱 초기화 시 호출. Supabase에서 최신순으로 조회 후 스토어에 반영 */
  loadVocabulary: () => Promise<void>;
  addItem: (item: Omit<VocabularyItem, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  removeItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  hasItem: (englishText: string, chunking: string) => boolean;
  toggleItem: (item: Omit<VocabularyItem, 'id' | 'createdAt'>) => Promise<boolean>;
  setItems: (items: VocabularyItem[]) => void;
  clearError: () => void;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  loadVocabulary: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from(VOCABULARY_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const items = (data ?? []).map((row) => rowToItem(row as VocabularyRow));
      set({ items, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '단어장을 불러오지 못했습니다.';
      set({ items: [], error: message });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (item) => {
    set({ error: null });
    try {
      const row = itemToRow(item);
      const { data, error } = await supabase
        .from(VOCABULARY_TABLE)
        .insert(row)
        .select('*')
        .single();

      if (error) throw error;
      const newItem = rowToItem(data as VocabularyRow);
      set((state) => ({
        items: [newItem, ...state.items],
        error: null,
      }));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  removeItem: async (id) => {
    set({ error: null });
    try {
      const { error } = await supabase
        .from(VOCABULARY_TABLE)
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        error: null,
      }));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  hasItem: (englishText, chunking) =>
    get().items.some(
      (i) => i.englishText === englishText && i.chunking === chunking
    ),

  toggleItem: async (item) => {
    const { hasItem, addItem, removeItem, items } = get();
    if (hasItem(item.englishText, item.chunking)) {
      const found = items.find(
        (i) => i.englishText === item.englishText && i.chunking === item.chunking
      );
      if (found) {
        const result = await removeItem(found.id);
        return !result.success ? (get().hasItem(item.englishText, item.chunking) as boolean) : false;
      }
      return false;
    }
    const result = await addItem(item);
    return result.success;
  },

  setItems: (items) => set({ items }),

  clearError: () => set({ error: null }),
}));
