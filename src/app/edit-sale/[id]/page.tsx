'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import { Sale } from '@/core/sale/saleEntity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  amount: z.number().min(0, 'Valor deve ser maior que zero'),
  soldAt: z.string({
    error: 'Data deve ser uma data válida',
  }),
  customerName: z.string({
    error: 'Deve ser um nome válido',
  }),
  pgDate: z.string({
    error: 'Data deve ser uma data válida',
  }).optional().nullable(),
  deliveredDate: z.string({
    error: 'Data deve ser uma data válida',
  }).optional().nullable(),
  quantity: z.number().int().min(1, 'Quantidade deve ser ao menos 1 grama'),
});

export default function EditSale({ params }: { params: Promise<{ id: string }>}) {
  const router = useRouter();
  const resolvedParams = use(params)
  const [sale, setSale] = useState<Sale | null>(null)
  console.log("PARAMS", resolvedParams)
  const [customers, setCustomers] =  useState([])

 useEffect( () =>{

  const fetchSale = async () => {

    if(!resolvedParams.id) {
      return;
    }

    const data = await fetch(`/api/sale/get/${resolvedParams.id}`)
    const sale = await data.json()
    setSale(sale)

    if (!sale) {
      alert("Sale not found")
      router.push('/sales');
      return;
    }

    form.reset({
      amount:sale.amount,
      customerName:sale.customer.name,
      deliveredDate: sale.deliveredDate,
      pgDate:sale.pgDate,
      quantity:sale.quantity,
      soldAt:sale.soldAt,
    })


  }
  
  const fetchCustomers = async () => {
    const data = await fetch('/api/customer/getAll')
    const json = await data.json()
    setCustomers(json)
  }

  fetchSale()
  fetchCustomers()

}, [resolvedParams])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:{
      amount:1,
      customerName:'',
      deliveredDate:null,
      soldAt: '',
      pgDate:null,
      quantity:1
    }
  });

  function onSubmit(values: z.infer<typeof schema>) {
      const payload = {
    ...values,
    soldDate: values.soldAt,
    pgDate: values.pgDate,
    deliveredDate: values.deliveredDate
  };

  fetch(`/api/sale/edit/${resolvedParams.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao editar venda");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Venda editada com sucesso:", data);
    })
    .catch((err) => {
      console.error("Erro ao editar venda:", err.message);
      alert(err.message);
    });


    // router.push(`/view-sale/${resolvedParams.id}`);
  }

  return (
    <div className="font-sans grid justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full max-w-4xl">
        <div className="flex flex-col gap-8 px-8">
          <div className="flex flex-row items-center gap-4">
            <Pencil className="h-10 w-10" />
            <h2 className="text-2xl font-bold">Editar Venda</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value || '0'))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Escolha o cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers && customers.map((customer: { name: string }) => (
                              <SelectItem key={customer.name} value={customer.name} onClick={() => field.onChange(customer.name)}>{customer.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soldAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Venda</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pgDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Entrega (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade (gramas)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value || '0'))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="submit">Salvar</Button>
                <Button type="button" variant="secondary" onClick={() => router.push(`/view-sale/${resolvedParams.id}`)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
