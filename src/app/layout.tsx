import type { Metadata } from "next";
import { ClerkProvider, SignedIn, useUser } from "@clerk/nextjs"; // ← add this
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottomNavigation";
import { Toaster } from "sonner";
import { ptBR } from '@clerk/localizations'
import ClientClerkProvider from "@/components/cleintClerkProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiniGestor",
  description: "Gerencie suas vendas de forma tranquila.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClientClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header/>
          {children}
          <SignedIn>
            <BottomNavigation />
            <Toaster position="top-center" />
          </SignedIn>

        </body>
      </html>
    </ClientClerkProvider>
  );
}
