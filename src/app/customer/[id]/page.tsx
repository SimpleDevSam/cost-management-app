"use client";
import { formatDate } from "@/app/utils/formattingUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/core/customer/customerEntity";
import { Eye } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ViewCustomer({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const resolvedParams = use(params)
  const [customer, setCustomer] = useState<Customer>()

  useEffect(() => {

    const fetchCustomer = async () => {

      if (!resolvedParams.id) {
        return;
      }

      try {
        setIsLoading(true)
        const data = await fetch(`/api/customer/get/${resolvedParams.id}`)
        const customer = await data.json()

        setCustomer(customer)

        if (!customer) {
          throw new Error()
        }
      } catch {
        toast('❌ Erro ao buscar cliente')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomer()

  }, [resolvedParams])

  return (
    <div className="font-sans grid justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full max-w-4xl">
        <div className="flex flex-col gap-8 px-8">
          <div className="flex flex-row items-center gap-4">
            <Eye className="h-10 w-10" />
            <h2 className="text-2xl font-bold">Detalhes do Cliente</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Cliente #{customer?._id}</CardTitle>
            </CardHeader>
            
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <p className="font-semibold">Valor Total Gasto:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>R$ {customer?.totalAmountSpent.toFixed(2)}</p>}
                  </div>
                  <div>
                  <p className="font-semibold">Nome:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>{customer?.name}</p>}
                  </div>
                  <div>
                  <p className="font-semibold">Criado em:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>{formatDate(customer?.createdAt)}</p>}
                  </div>
                  <div>
                  <p className="font-semibold">Atualizado em:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>{formatDate(customer?.updatedAt)}</p>}
                  </div>
                  <div>
                  <p className="font-semibold">Ultima Compra:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>{formatDate(customer?.lastPurchase)}</p>}
                  </div>
                  <div>
                  <p className="font-semibold">Quantidade de Vendas:</p>
                  {isLoading ? <Skeleton className="h-8 w-full" /> : <p>{customer?.totalSales.toString()}</p>}
                  </div>
                </div>
              </CardContent>
          </Card>
          <div className="flex justify-end gap-4">
            <Link href={`/customer/edit/${customer?._id}`}>
              <Button>Editar</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
