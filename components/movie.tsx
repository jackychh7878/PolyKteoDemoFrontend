import Image from "next/image";
import { SearchResult } from "@/types/search";
import { useState } from "react";

const Movie = ({ result }: { result: SearchResult }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Hardcoded dummy data for the demo
  // const dummyData = {
  //   text: "# Title: 空調冷凍水流量控制系統及方法的專利概述和技術摘要 \n\n#### Reference Links:\n\n1. [Download PDF](https://patentimages.storage.googleapis.com/3b/1d/76/e7afcbea094a53/CN102889664B.pdf)\n2. [Espacenet](https://worldwide.espacenet.com/publicationDetails/biblio?CC=CN&NR=102889664B&KC=B&FT=D)\n3. [Global Dossier](https://globaldossier.uspto.gov/result/application/CN/201110202193/1)\n4. [Discuss on StackExchange](https://patents.stackexchange.com/questions/tagged/CN102889664B)\n5. [Google Patent](https://patents.google.com/patent/CN102889664B)\n\n## Summary:\n\n#### English: The patent CN102889664B details a water flow control system and method specifically designed for central air conditioning systems using secondary pumping circuits. It includes several steps to initiate the system and continuously regulate water flow through the detection and measurement of pressure differentials at various points in the system. The main objective is to prevent reverse flow in bypass pipes, ensuring the water supply to the user side does not exceed the return flow to the main unit, ultimately improving efficiency and energy conservation. The original assignee of the patent is Hong Kong Polytechnic University. The patent was filed on July 19, 2011, and published on December 10, 2014. For this patent, there are multiple related publications and legal events, indicating ongoing relevance in the industry.\n\n#### Number of Search Results:\n- Total patents found: 1\n\n### 中文:\n本專利CN102889664B詳細介紹了一種專為中央空調系統設計的水流量控制系統和方法，涉及次級泵循環。該系統包括幾個步驟，以啟動系統並不斷調節水流，通過在系統不同位置檢測和測量壓差來進行。其主要目的是防止旁通管中的逆流，確保向用戶側供水不超過與主機之間的回流，從而提高效率和節能。該專利的原始受讓方為香港理工大學，於2011年7月19日申請，並於2014年12月10日公布。針對此專利，還有多個相關公報和法律事件，顯示其在行業內的持續重要性。\n\n#### 搜尋結果數量:\n- 總專利數量: 1"
  // };

  const dummyData = {
    text: "\n\n#### Reference Links:\n\n1. [Download PDF](https://patentimages.storage.googleapis.com/56/5b/49/16c18e65653750/CN109984915B.pdf)\n2. [Espacenet](https://worldwide.espacenet.com/publicationDetails/biblio?CC=CN&NR=109984915B&KC=B&FT=D)\n3. [Global Dossier](https://globaldossier.uspto.gov/result/application/CN/201810001529/1)\n4. [Discuss on StackExchange](https://patents.stackexchange.com/questions/tagged/CN109984915B)\n5. [Google Patent](https://patents.google.com/patent/CN109984915B)\n\n## Summary:\n\n#### English: \nThe patent CN109984915B describes a rehabilitation device, method, computer storage medium, and electronic device specifically designed for auxiliary medical rehabilitation training. The system comprises functional electrical stimulation components that generate muscle stimulation signals through a stimulation electrode array, and mechanical motion assistance components that provide mechanical force assistance to target joints. By combining mechanical force assistance with functional electrical stimulation, this device improves the limitations of single assistance approaches and reduces the power requirements of the motors, contributing to energy efficiency and compactness. This device is suitable for patients recovering from conditions such as stroke, ensuring physiological muscle strength and facilitating movement in rehabilitation training. The original assignee of the patent is Hong Kong Polytechnic University, with the application filed on January 2, 2018, and granted on November 5, 2021. \n\n#### Number of Search Results:\n- Total patents found: 1\n\n### 中文:\n本專利CN109984915B描述了一種專門為輔助醫療康復訓練設計的康復裝置、方法、計算機存儲介質和電子設備。該系統包括功能性電刺激組件，通過刺激電極陣列生成肌肉刺激信號，以及機械運動輔助組件，為目標關節提供機械力量輔助。通過將機械力量輔助與功能性電刺激相結合，該裝置改善了單一輔助方法的局限性，並降低了馬達的功率要求，對提高能效和壓縮體積具有重要意義。該裝置適用於中風等情況的患者，能確保生理肌肉力量並促進康復訓練中的運動。該專利的原始受讓方為香港理工大學，於2018年1月2日申請，並於2021年11月5日獲批。\n\n#### 搜尋結果數量:\n- 總專利數量: 1"
  }

  // Dummy image URLs
  const patentImages = [
    "https://patentimages.storage.googleapis.com/55/d3/df/7f2ce91d83761a/HDA0001537226400000021.png",
    "https://patentimages.storage.googleapis.com/19/5a/f4/7a2920a750a0ce/HDA0001537226400000022.png",
    "https://patentimages.storage.googleapis.com/a8/70/53/ff87b4ee4dee70/HDA0001537226400000062.png"
  ];

  const showContent = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setShowPopup(true);
    }, 500);
  };

  // Function to render markdown links as actual HTML links
  const renderLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, '<a href="$2" target="_blank" class="text-blue-400 hover:underline">$1</a>');
  };

  // Function to parse and format the content
  const formatContent = (text: string) => {
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
          {result.title || 'No Title'}
        </h2>
        <p className="text-sm text-neutral-400 mb-4">{result.description || 'No Description'}</p>
        
        {result.url && (
          <button 
            onClick={showContent}
            className="inline-block px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors w-fit"
          >
            View
          </button>
        )}
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-6xl w-[95%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              {/*<h3 className="text-xl font-bold text-white">{result.title || 'Patent Summary'}</h3>*/}
              <h3 className="text-2xl font-bold text-white">{'康復裝置、方法、計算機存儲介質和電子設備的專利概述'}</h3>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-neutral-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Patent Images Gallery */}
            {!isLoading && (
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
              ) : (
                <div 
                  className="prose prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formatContent(dummyData.text) }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
