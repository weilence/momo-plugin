import { createStore } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export interface WordLibrary {
  title: string;
  description: string;
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
  syncing: boolean;
  addWord: (word: string) => void;
  deleteWord: (index: number) => void;
  syncWordLibrary: () => Promise<void>;
}

interface Notepad {
  id: string;
  status: "PUBLISHED" | "UNPUBLISHED" | "DELETED";
  title: string;
  brief: string;
  content: string;
  tags: string[];
}

export const wordLibraryStore = createStore<WordLibraryStore>()(
  persist(
    (set, get) => ({
      wordLibrary: [
        {
          title: "浏览器单词同步",
          description: "浏览器插件单词同步(请勿修改描述)",
          tags: [],
          words: [],
        },
      ],
      syncing: false,
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
      syncWordLibrary: async () => {
        set({ syncing: true });
        const state = get();
        try {
          const data = await api
            .get<{ notepads: Notepad[] }>(`notepads`)
            .json();
          const pluginNotePad = data.notepads.find(
            (notepad) => notepad.brief === state.wordLibrary[0].description
          );
          const jsonBody = {
            notepad: {
              status: "UNPUBLISHED",
              content: state.wordLibrary[0].words.join("\n"),
              title: state.wordLibrary[0].title,
              brief: state.wordLibrary[0].description,
              tags: [],
            },
          };
          if (!pluginNotePad) {
            await api.post(`notepads`, {
              json: jsonBody,
            });
          } else {
            await api.post(`notepads/${pluginNotePad.id}`, {
              json: jsonBody,
            });
          }
        } finally {
          set({ syncing: false });
        }
      },
    }),
    createStorage("word-library", () => wordLibraryStore.persist.rehydrate())
  )
);
