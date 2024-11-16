import { createStore } from "zustand";
import { persist, PersistOptions, StorageValue } from "zustand/middleware";

export interface WordLibrary {
  title: string;
  description: string;
  tags: string[];
  words: string[];
}

function createStorage<T>(name: string, rehydrate: () => void) {
  const key = `local:${name}` as const;
  storage.watch(key, () => {
    rehydrate();
  });

  return {
    name,
    storage: {
      getItem: async (_) => {
        const data = await storage.getItem<T>(key);
        return { state: data };
      },
      setItem: async (_, value) => {
        return await storage.setItem(key, value.state);
      },
      removeItem: async (_) => {
        return await storage.removeItem(key);
      },
    },
  } as PersistOptions<T>;
}

export const configStore = createStore<{
  apiToken: string;
  setApiToken: (apiToken: string) => void;
}>()(
  persist(
    (set) => ({
      apiToken: "",
      setApiToken: (apiToken: string) => {
        set({ apiToken });
      },
    }),
    createStorage("config", () => configStore.persist.rehydrate())
  )
);

interface WordLibraryStore {
  wordLibrary: WordLibrary[];
  addWord: (word: string) => void;
  deleteWord: (index: number) => void;
}

export const wordLibraryStore = createStore<WordLibraryStore>()(
  persist(
    (set) => ({
      wordLibrary: [
        {
          title: "Default",
          description: "Default word library",
          tags: [],
          words: [],
        },
      ],
      addWord: (word: string) => {
        set((state) => {
          state.wordLibrary[0].words.push(word);
          return state;
        }, true);
      },
      deleteWord: (index: number) => {
        set((state) => {
          state.wordLibrary[0].words.splice(index, 1);
          return state;
        }, true);
      },
    }),
    createStorage("word-library", () => wordLibraryStore.persist.rehydrate())
  )
);
