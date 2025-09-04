"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sale } from "@/core/sale/saleEntity";
import { Eye } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ViewSale({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const resolvedParams = use(params)
  const [sale, setSale] = useState<Sale>()

  useEffect(() => {

    const fetchSale = async () => {

      try {
        setIsLoading(true)

        if (!resolvedParams.id) {
          return;
        }

        const data = await fetch(`/api/sale/get/${resolvedParams.id}`)
        const sale = await data.json()

        setSale(sale)

        if (!sale) {
          throw new Error()
        }
      } catch (err) {
        toast("❌ Venda não encontrada, favor recarregar página")
      } finally {
        setIsLoading(false)
      }

    }

    fetchSale()

  }, [resolvedParams])

  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return '-';

    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('pt-BR'); // Brazilian Portuguese format
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return 'Data inválida';
    }
  };


  return (
    <div className="font-sans grid justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full max-w-4xl">
        <div className="flex flex-col gap-8 px-8">
          <div className="flex flex-row items-center gap-4">
            <Eye className="h-10 w-10" />
            <h2 className="text-2xl font-bold">Detalhes da Venda</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Venda #{sale?._id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Valor:</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>R$ {sale?.amount.toFixed(2)}</p>}
              </div>
              <div>
                <p className="font-semibold">Cliente:</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>{sale?.customer.name}</p>}
              </div>
              <div>
                <p className="font-semibold">Data da Venda:</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>{formatDate(sale?.soldAt)}</p>}
              </div>
              <div>
                <p className="font-semibold">Data de Pagamento:</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>{formatDate(sale?.pgDate)}</p>}
              </div>
              <div>
                <p className="font-semibold">Data de Entrega:</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>{formatDate(sale?.deliveredDate)}</p>} 
              </div>
              <div>
                <p className="font-semibold">Quantidade (gramas):</p>
                {isLoading ? <Skeleton className="h-8 w-full"/> : <p>{sale?.quantity}</p>}
              </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-4">
            <Link href={`/edit-sale/${sale?._id}`}>
              <Button>Editar</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
