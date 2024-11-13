import { createStore, useStore as baseUseStore, create } from "zustand";
import { persist } from "zustand/middleware";

type WordLibrary = {
  title: string;
  description: string;
  tags: string[];
  words: string[];
};

const createStorage = <T>(name: string) => ({
  name,
  storage: {
    getItem: async (name: string) => {
      return await storage.getItem<any>(`local:${name}`);
    },
    setItem: async (name: string, value: T) => {
      return await storage.setItem(`local:${name}`, value);
    },
    removeItem: async (name: string) => {
      return await storage.removeItem(`local:${name}`);
    },
  },
});

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
    createStorage("config")
  )
);

export const wordLibraryStore = createStore<{
  wordLibrary: WordLibrary[];
  addWord: (word: string) => void;
}>()(
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
    }),
    createStorage("word-library")
  )
);

export default {};
