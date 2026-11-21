import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { AppProvider } from "@/contexts/AppContext";
import SessionCleanupInitializer from "@/components/SessionCleanupInitializer";
import { Suspense } from 'react';
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prematrículas Informática",
  description: "UNT",
  icons: {
    icon: "/logo_info.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
    <html> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AppProvider>
            {/* <SessionCleanupInitializer /> */}
            {children}
          </AppProvider>
        </Providers>
        <Footer />
      </body>
    </html>
    </Suspense>
  );
}