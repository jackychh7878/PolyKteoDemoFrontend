'use client';

import Script from 'next/script';

export default function DifyChatbot() {
  return (
    <>
      {/* Dify Chatbot Integration */}
      <Script id="dify-chatbot-config" strategy="afterInteractive">
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
      />
      
      {/* Chatbot Styling */}
      <style jsx global>{`
        #dify-chatbot-bubble-button {
          background-color: #1C64F2 !important;
        }
        #dify-chatbot-bubble-window {
          width: 40rem !important;
          height: 40rem !important;
        }
      `}</style>
    </>
  );
}
