"use client";
import { Action, queryAtom, searchAtom, confidenceLevelAtom, sortingOrderAtom, moviesAtom } from "@/atoms/search-atoms";
import { useAtom, useAtomValue } from "jotai";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";


const SearchBar = () => {
  const [query, setQuery] = useAtom(queryAtom);
  const [isSearching, searchHandler] = useAtom(searchAtom);
  const [confidenceLevel, setConfidenceLevel] = useAtom(confidenceLevelAtom);
  const [sortingOrder, setSortingOrder] = useAtom(sortingOrderAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const results = useAtomValue(moviesAtom);

  const keyPressHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        searchHandler(Action.SEARCH, sortingOrder, currentPage, pageSize);
      } else if (e.key === "Escape") {
        setQuery("");
      }
    },
    [searchHandler, setQuery, sortingOrder, currentPage, pageSize]
  );

  // Keyboard Event Listener
  useEffect(() => {
    document.addEventListener("keydown", keyPressHandler);
    return () => {
      document.removeEventListener("keydown", keyPressHandler);
    };
  }, [keyPressHandler]);

  return (
    <div className="w-full">
      <div className="flex items-center w-full gap-1 px-4 border rounded-md group focus-within:border-blue-400 bg-white focus-within:outline-4 focus-within:outline-blue-200 border-gray-300">
        <Search size="16" color="#1e40af" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for..."
          className="w-full px-4 py-3 bg-transparent rounded-md text-gray-800 group focus:outline-none"
        />
        {isSearching ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Searching...</span>
          </div>
        ) : (
          <button
            onClick={() => {
              searchHandler(Action.SEARCH, sortingOrder, 1, pageSize);
            }}
            className="search-button inline-block px-3 py-2 text-sm rounded-md transition-colors"
          >
            Search
          </button>
        )}
      </div>

      <div className="flex items-center w-full mt-2 px-4 py-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Search Precision:</span>
          <div className="flex gap-2">
            <button
                onClick={() => setConfidenceLevel(0)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    confidenceLevel === 0
                        ? 'bg-[#a02337] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Broad
            </button>
            <button
                onClick={() => setConfidenceLevel(0.25)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    confidenceLevel === 0.25
                        ? 'bg-[#a02337] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Balanced
            </button>
            <button
                onClick={() => setConfidenceLevel(0.4)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    confidenceLevel === 0.4
                        ? 'bg-[#a02337] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Precise
            </button>
          </div>
        </div>
        <div className="search-sort ml-auto">
          <select
              id="control-sort"
              value={sortingOrder}
              onChange={(e) => {
                setSortingOrder(e.target.value);
                // Only trigger search if there are existing results
                if (results.length > 0) {
                  searchHandler(Action.SEARCH, e.target.value, currentPage, pageSize);
                }
              }}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:border-blue-400 transition-colors"
          >
            <option value="REL_DESC">Sort by Relevance: Descending</option>
            <option value="REL_ASC">Sort by Relevance: Ascending</option>
            <option value="FSD_ASC">Sort by Faculties, Schools & Departments: A-Z</option>
            <option value="FSD_DESC">Sort by Faculties, Schools & Departments: Z-A</option>
            <option value="DATE_DESC">Sort by Latest date: Latest</option>
            <option value="DATE_ASC">Sort by Latest date: Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
