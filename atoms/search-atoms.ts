import { atom } from "jotai";
import { SearchResult } from "@/types/search";

export enum Action {
  SEARCH = "SEARCH",
  RESET = "RESET",
}

// Search Handler Function
const searchHandler = async (query: string) => {
  try {
    const res = await fetch(`https://steveykyu.app.n8n.cloud/webhook/73551d63-6381-4a73-bfde-164e6e3ccf6d?query=${query}`);
    if (!res.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await res.json();
    return data.output?.output || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

const searchActiveAtom = atom(false);

export const queryAtom = atom("", (_get, set, query) => {
  if (query === "") {
    set(searchAtom, Action.RESET);
  }
  set(queryAtom, query);
});

export const searchAtom = atom(
  (get) => get(searchActiveAtom),
  async (get, set, action: Action) => {
    const query = get(queryAtom);
    if (action === Action.SEARCH) {
      if (query.length === 0) {
        return;
      } else {
        set(searchActiveAtom, true);
        const data = await searchHandler(query);
        set(moviesAtom, data);
        set(searchActiveAtom, false);
      }
    } else if (action === Action.RESET) {
      set(searchActiveAtom, false);
      set(moviesAtom, []);
    }
  }
);

// Initialize with an empty array of SearchResult
export const moviesAtom = atom<SearchResult[]>([]);
