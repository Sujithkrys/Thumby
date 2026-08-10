import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { StoreProvider } from "@/lib/store";
import { AboutThumby } from "@/components/layout/AboutThumby";
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Thumby — AI Thumbnails",
  description: "Browse and generate high-converting YouTube thumbnails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased bg-studio text-ink font-body`}
      >
        <StoreProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-[22px] min-w-0 overflow-auto">
              {children}
            </main>
          </div>
          <AboutThumby />
        </StoreProvider>
      </body>
    </html>
  );
}
