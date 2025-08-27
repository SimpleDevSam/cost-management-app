import { BottomNavigation } from "@/components/bottomNavigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export default function Home() {

  const sellerName  = 'Maria Cristina';

  return (
    <div className="font-sans flex flex-row items-center items-center justify-center min-h-screen py-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div>
            <Card className="p-4">
              <CardDescription>Olá, {sellerName}!</CardDescription>
            </Card>
          </div>
      </main>
    </div>
  );
}
