import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PralayDrishti | AI Disaster Intelligence",
  description: "AI-powered disaster intelligence and emergency triage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
