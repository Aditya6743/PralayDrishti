import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MagneticCursor } from "@/components/ui/cursor";
import { GlobalMesh } from "@/components/ui/GlobalMesh";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PralayDrishti | Disaster Intelligence",
  description: "AI-powered emergency intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-sans antialiased min-h-screen`}
      >
        <GlobalMesh />
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
