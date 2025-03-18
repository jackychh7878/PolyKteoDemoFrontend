import Image from "next/image";
import { SearchResult } from "@/types/search";
import { useState } from "react";

const Movie = ({ result }: { result: SearchResult }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTextFromUrl = async () => {
    if (!result.url) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://steveykyu.app.n8n.cloud/webhook/4b406f95-bacb-45b1-880a-885f3b3391f7?url=${encodeURIComponent(result.url)}`);
      const data = await response.json();
      setApiResponse(data.text || "No text available");
    } catch (error) {
      console.error("Error fetching text:", error);
      setApiResponse("Failed to load content");
    } finally {
      setIsLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-md shadow-md bg-neutral-800 p-4">
      <div className="flex flex-col justify-between w-full h-full">
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">
          {result.title || 'No Title'}
        </h2>
        <p className="text-sm text-neutral-400 mb-4">{result.description || 'No Description'}</p>
        
        {result.url && (
          <button 
            onClick={fetchTextFromUrl}
            className="inline-block px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors w-fit"
          >
            View Content
          </button>
        )}
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{result.title || 'Content'}</h3>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-neutral-200">
              {isLoading ? (
                <p className="text-center py-4">Loading...</p>
              ) : (
                <p className="whitespace-pre-line">{apiResponse}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
