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
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
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
