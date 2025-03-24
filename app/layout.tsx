import "./globals.css";

export const metadata = {
  title: "PolyU KTEO Search Engine",
  description: "Knowledge Transfer and Entrepreneurship Office",
};

import { Inter } from "next/font/google";
import DifyChatbot from "@/components/DifyChatbot";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="header-container">
          <div className="logo-left">
            <Image 
              src="https://polyukteo.10u.org/kteo/polyu-ip-portal/themes/polyurio/static/static/images/logo.png"
              alt="KTEO Logo"
              width={400}
              height={110}
              priority
              unoptimized={true}
            />
          </div>
          <div className="logo-right">
            <Image 
              src="https://polyukteo.10u.org/kteo/polyu-ip-portal/themes/polyurio/static/static/images/fact-logo-1x.png"
              alt="PolyU Logo"
              width={400}
              height={110}
              priority
              unoptimized={true}
            />
          </div>
        </header>
        <div className="bg-[#a02337] py-12">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-3xl font-bold text-white">Knowledge Transfer</h1>
          </div>
        </div>
        {children}
        <DifyChatbot />
      </body>
    </html>
  );
}
