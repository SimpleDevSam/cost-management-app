"use client";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      proxyUrl="/clerk"
      localization={ptBR}
    >
      {children}
    </ClerkProvider>
  );
}