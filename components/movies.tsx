"use client";
import { moviesAtom } from "@/atoms/search-atoms";
import { useAtomValue } from "jotai";
import Movie from "./movie";
import { SearchResult } from "@/types/search";

const Movies = () => {
  const results = useAtomValue(moviesAtom) as SearchResult[];
  
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="border-t border-neutral-700 my-4"></div>
      <h2 className="text-xl font-semibold text-neutral-50 mb-4">Search Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <Movie key={`${result.title}-${index}`} result={result} />
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-10">
          <p className="text-neutral-400">No results found for your search query.</p>
        </div>
      )}
    </div>
  );
};

export default Movies;
