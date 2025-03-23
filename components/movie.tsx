import Image from "next/image";
import { SearchResult } from "@/types/search";
import { useState, useEffect } from "react";

const Movie = ({ result }: { result: SearchResult }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [patentData, setPatentData] = useState<any>(null);
  const [patentImages, setPatentImages] = useState<string[]>([]);

  // Function to extract image URLs from ai_summary
  const extractImageUrls = (summary: string): { urls: string[], cleanedSummary: string } => {
    // Using a more compatible approach without the 's' flag
    const imageUrlsRegex = /<image_urls>([\s\S]*?)<\/image_urls>/;
    const match = summary.match(imageUrlsRegex);
    
    let urls: string[] = [];
    let cleanedSummary = summary;
    
    if (match && match[1]) {
      // Extract URLs from the matched content
      const urlContent = match[1].trim();
      if (urlContent) {
        // Split by commas first, then trim each URL
        urls = urlContent.split(',').map(url => url.trim()).filter(url => url);
      }
      
      // Remove the image_urls tag and its content from the summary
      cleanedSummary = summary.replace(imageUrlsRegex, '');
    }
    
    return { urls, cleanedSummary };
  };

  // Function to fetch patent data if needed
  const fetchPatentData = async () => {
    if (!result.ai_summary && result.query) {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(result.query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patent data');
        }
        
        const data = await response.json();
        
        // Find the matching patent data based on the result
        const matchingPatent = data.find((patent: any) => 
          patent.sys_id === result.sys_id || 
          patent.official_title === result.title
        ) || data[0]; // Use the first result if no match found
        
        if (matchingPatent) {
          return matchingPatent;
        }
      } catch (error) {
        console.error("Error fetching patent data:", error);
      }
    }
    return null;
  };

  const processPatentData = async () => {
    setIsLoading(true);
    
    try {
      // If we already have ai_summary, use it directly
      if (result.ai_summary) {
        const { urls, cleanedSummary } = extractImageUrls(result.ai_summary);
        setPatentImages(urls.length > 0 ? urls : []);
        
        setPatentData({
          ...result,
          ai_summary: cleanedSummary
        });
      } else {
        // Otherwise, try to fetch it
        const fetchedData = await fetchPatentData();
        
        if (fetchedData && fetchedData.ai_summary) {
          const { urls, cleanedSummary } = extractImageUrls(fetchedData.ai_summary);
          setPatentImages(urls.length > 0 ? urls : []);
          
          setPatentData({
            ...fetchedData,
            ai_summary: cleanedSummary
          });
        } else {
          // If we still don't have ai_summary, just use what we have
          setPatentData(result);
        }
      }
    } catch (error) {
      console.error("Error processing patent data:", error);
      setPatentData(result);
    } finally {
      setIsLoading(false);
    }
  };

  const showContent = () => {
    setIsLoading(true);
    processPatentData();
    setShowPopup(true);
  };

  // Function to render markdown links as actual HTML links
  const renderLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, '<a href="$2" target="_blank" class="text-blue-400 hover:underline">$1</a>');
  };

  // Function to parse and format the content
  const formatContent = (text: string) => {
    if (!text) return '';
    
    const sections = text.split('\n\n');
    const formattedSections = sections.map(section => {
      if (section.startsWith('####')) {
        return `<h4 class="text-lg font-semibold mt-4 mb-2">${section.replace('####', '')}</h4>`;
      } else if (section.startsWith('###')) {
        return `<h3 class="text-xl font-semibold mt-4 mb-2">${section.replace('###', '')}</h3>`;
      } else if (section.startsWith('##')) {
        return `<h2 class="text-2xl font-bold mt-6 mb-3">${section.replace('##', '')}</h2>`;
      } else if (section.startsWith('#')) {
        return `<h1 class="text-3xl font-bold mt-6 mb-4">${section.replace('#', '')}</h1>`;
      } else if (section.includes('- ')) {
        return `<ul class="list-disc pl-5 my-2">${section.split('\n').map(item => `<li>${item.replace('- ', '')}</li>`).join('')}</ul>`;
      } else {
        return `<p class="my-2">${section}</p>`;
      }
    });

    return renderLinks(formattedSections.join(''));
  };

  return (
    <div className="relative overflow-hidden rounded-md shadow-md bg-neutral-800 p-4">
      <div className="flex flex-col justify-between w-full h-full">
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">
          {result.official_title || result.title || 'No Title'}
        </h2>
        <p className="text-sm text-neutral-400 mb-4">{result.description || 'No Description'}</p>
        
        {/* Display image if available */}
        {(result.image || (result.ai_summary && extractImageUrls(result.ai_summary).urls.length > 0)) && (
          <div className="relative h-40 w-full mb-4 bg-neutral-900 rounded overflow-hidden">
            <Image
              src={result.image || extractImageUrls(result.ai_summary || '').urls[0] || ''}
              alt={result.title || 'Preview image'}
              fill
              className="object-contain"
            />
          </div>
        )}
        
        <button 
          onClick={showContent}
          className="inline-block px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors w-fit"
        >
          View
        </button>
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-6xl w-[95%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">{patentData?.official_title || result.official_title || result.title || 'Patent Summary'}</h3>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-neutral-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Patent Images Gallery */}
            {!isLoading && patentImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-white">Patent Figures</h4>
                <div className="relative">
                  <div className="relative h-[400px] w-full bg-neutral-900 rounded-lg overflow-hidden mb-2">
                    <img 
                      src={patentImages[activeImageIndex]} 
                      alt={`Patent figure ${activeImageIndex + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  
                  {/* Navigation arrows */}
                  {patentImages.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImageIndex(prev => (prev === 0 ? patentImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        aria-label="Previous image"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => setActiveImageIndex(prev => (prev === patentImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        aria-label="Next image"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnails */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {patentImages.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-400 mt-1">Figure {activeImageIndex + 1} of {patentImages.length}</p>
              </div>
            )}
            
            <div className="text-neutral-200">
              {isLoading ? (
                <p className="text-center py-4">Loading patent information...</p>
              ) : patentData ? (
                <div 
                  className="prose prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formatContent(patentData.ai_summary) }}
                />
              ) : (
                <p className="text-center py-4">No patent information available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
