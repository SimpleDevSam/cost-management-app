'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, DollarSign, HomeIcon, PersonStanding } from "lucide-react";
import { useRouter } from 'next/navigation';

export function BottomNavigation() {
    const router = useRouter();
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-2">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home" onClick={() => router.push('/')} className="flex flex-row items-center gap-1 py-2">
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </TabsTrigger>
          <TabsTrigger value="sales" onClick={() => router.push('/sales')} className="flex flex-row items-center gap-1 py-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="add-customer" onClick={() => router.push('/add-customer')}  className="flex flex-row items-center gap-1 py-2">
            <PlusCircle className="h-5 w-5"/>
            <span className="text-xs">Cliente</span>
          </TabsTrigger>
          <TabsTrigger value="customers" onClick={() => router.push('/customers')}  className="flex flex-row items-center gap-1 py-2">
            <PersonStanding className="h-5 w-5"/>
            <span className="text-xs">Clientes</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}