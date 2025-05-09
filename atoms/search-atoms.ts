import { atom } from "jotai";
import { SearchResult } from "@/types/search";

export enum Action {
  SEARCH = "SEARCH",
  RESET = "RESET",
}

// Search Handler Function
const searchHandler = async (query: string, confidenceLevel: number = 0.25) => {
  try {
    // Use our local API proxy instead of calling the external API directly
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&confidence_level=${confidenceLevel}`);
    if (!res.ok) {
      throw new Error('Failed to fetch search results');
    }
    const data = await res.json();
    
    // Transform the data to match the expected SearchResult format
    return data.map((item: any) => ({
      title: item.official_title || '',
      description: `Inventor: ${item.inventor || 'Unknown'} | Department: ${item.department || 'N/A'} | Tech Sector: ${item.tech_sector || 'N/A'}`,
      official_title: item.official_title || '',
      sys_id: item.sys_id,
      query: query,
      ai_summary: item.ai_summary || '',
      ai_short_summary: item.ai_short_summary || '',
      country_region: item.country_region || '',
      department: item.department || '',
      google_patent_link: item.google_patent_link || '',
      inventor: item.inventor || '',
      similarity: item.similarity || 0,
      tech_sector: item.tech_sector || '',
      is_tech: item.is_tech || false
    }));
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

// Add a new atom to store the confidence level with a default value of 0.25
export const confidenceLevelAtom = atom<number>(0.25);

export const searchAtom = atom(
  (get) => get(searchActiveAtom),
  async (get, set, action: Action) => {
    const query = get(queryAtom);
    const confidenceLevel = get(confidenceLevelAtom);
    if (action === Action.SEARCH) {
      if (query.length === 0) {
        return;
      } else {
        set(searchActiveAtom, true);
        const data = await searchHandler(query, confidenceLevel);
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
