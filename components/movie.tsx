import Image from "next/image";
import { SearchResult } from "@/types/search";

const Movie = ({ result }: { result: SearchResult }) => {
  return (
    <div className="relative overflow-hidden rounded-md shadow-md bg-neutral-800 p-4">
      <div className="flex flex-col justify-between w-full h-full">
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">
          {result.title || 'No Title'}
        </h2>
        <p className="text-sm text-neutral-400 mb-4">{result.description || 'No Description'}</p>
        
        {result.url && (
          <a 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors w-fit"
          >
            Learn more
          </a>
        )}
      </div>
    </div>
  );
};

export default Movie;
