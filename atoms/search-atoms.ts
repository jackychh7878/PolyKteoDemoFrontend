import { atom } from "jotai";
import { SearchResult } from "@/types/search";

export enum Action {
  SEARCH = "SEARCH",
  RESET = "RESET",
}

interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

// Search Handler Function
const searchHandler = async (query: string, confidenceLevel: number = 0.25, sortingOrder: string = "REL_DESC", currentPage: number = 1, pageSize: number = 10) => {
  try {
    // Use our local API proxy instead of calling the external API directly
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&confidence_level=${confidenceLevel}&sorting_order=${sortingOrder}&current_page=${currentPage}&page_size=${pageSize}`);
    if (!res.ok) {
      throw new Error('Failed to fetch search results');
    }
    const responseData = await res.json();
    
    // Transform the data to match the expected SearchResult format
    const transformedResults = responseData.results.map((item: any) => ({
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

    return {
      results: transformedResults,
      pagination: responseData.pagination
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      results: [],
      pagination: {
        current_page: 1,
        page_size: pageSize,
        total_count: 0,
        total_pages: 0
      }
    };
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

// Add sorting order atom
export const sortingOrderAtom = atom<string>("REL_DESC");

// Add pagination atom
export const paginationAtom = atom<PaginationInfo>({
  current_page: 1,
  page_size: 10,
  total_count: 0,
  total_pages: 0
});

export const searchAtom = atom(
  (get) => get(searchActiveAtom),
  async (get, set, action: Action, sortingOrder: string = "REL_DESC", currentPage: number = 1, pageSize: number = 10) => {
    const query = get(queryAtom);
    const confidenceLevel = get(confidenceLevelAtom);
    if (action === Action.SEARCH) {
      if (query.length === 0) {
        return;
      } else {
        set(searchActiveAtom, true);
        const { results, pagination } = await searchHandler(query, confidenceLevel, sortingOrder, currentPage, pageSize);
        set(moviesAtom, results);
        set(paginationAtom, pagination);
        set(searchActiveAtom, false);
      }
    } else if (action === Action.RESET) {
      set(searchActiveAtom, false);
      set(moviesAtom, []);
      set(paginationAtom, {
        current_page: 1,
        page_size: 10,
        total_count: 0,
        total_pages: 0
      });
    }
  }
);

// Initialize with an empty array of SearchResult
export const moviesAtom = atom<SearchResult[]>([]);
