'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

// Add type declarations for the Dify chatbot
declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
    };
    DifyChat?: {
      init: (config: { token: string }) => void;
    };
  }
}

export default function DifyChatbot() {
  const configLoaded = useRef(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // This ensures the chatbot is properly initialized after both scripts are loaded
    const initChatbot = () => {
      if (configLoaded.current && scriptLoaded.current && window.DifyChat) {
        try {
          // Force re-initialization if needed
          if (document.querySelector('#dify-chatbot-bubble-button')) {
            return; // Already initialized
          }
          
          // Initialize the chatbot
          window.DifyChat?.init({
            token: '9aCW2AsIIVcGCeFn',
          });
        } catch (error) {
          console.error('Error initializing Dify chatbot:', error);
        }
      }
    };

    // Set up event listeners for script loading
    window.addEventListener('DifyChatbotConfigLoaded', () => {
      configLoaded.current = true;
      initChatbot();
    });
    
    window.addEventListener('DifyChatbotScriptLoaded', () => {
      scriptLoaded.current = true;
      initChatbot();
    });

    // Try to initialize if scripts were already loaded
    if (window.difyChatbotConfig && window.DifyChat) {
      configLoaded.current = true;
      scriptLoaded.current = true;
      initChatbot();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('DifyChatbotConfigLoaded', () => {
        configLoaded.current = true;
        initChatbot();
      });
      window.removeEventListener('DifyChatbotScriptLoaded', () => {
        scriptLoaded.current = true;
        initChatbot();
      });
      
      // Clean up the chatbot when component unmounts
      const chatbotElement = document.querySelector('#dify-chatbot-bubble-button');
      if (chatbotElement && chatbotElement.parentNode) {
        chatbotElement.parentNode.removeChild(chatbotElement);
      }
    };
  }, []);

  const handleConfigLoad = () => {
    configLoaded.current = true;
    window.dispatchEvent(new Event('DifyChatbotConfigLoaded'));
  };

  const handleScriptLoad = () => {
    scriptLoaded.current = true;
    window.dispatchEvent(new Event('DifyChatbotScriptLoaded'));
  };

  return (
    <>
      {/* Dify Chatbot Integration */}
      <Script 
        id="dify-chatbot-config" 
        strategy="afterInteractive"
        onLoad={handleConfigLoad}
      >
        {`
          window.difyChatbotConfig = {
            token: '9aCW2AsIIVcGCeFn'
          }
        `}
      </Script>
      <Script 
        src="https://udify.app/embed.min.js"
        id="9aCW2AsIIVcGCeFn"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      
      {/* Chatbot Styling */}
      <style jsx global>{`
          #dify-chatbot-bubble-button-bg-color{
              background-color: #a02337 !important;
          }

          #dify-chatbot-bubble-button {
          background-color: #a02337 !important;
        }
        #dify-chatbot-bubble-window {
          width: 40rem !important;
          height: 40rem !important;
        }
      `}</style>
    </>
  );
}
