"use client";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

export default function AddSell() {

  const [customers, setCustomers] =  useState([])

  useMemo(async () => {
    const data = await fetch('/api/customer/getAll')
    const json = await data.json()
    setCustomers(json)
  }, [])

  const schema = z.object({
    amount: z.number().min(0, "Valor deve ser maior que zero"),
    soldDate: z.date({
      error: "Data deve ser uma data válida",
    }),
    customer: z.string({
      error: "Deve ser um nome válido",
    }),
    pgDate: z.date({
          error: "Data deve ser uma data válida",
    }).optional().nullable(),
    deliveredDate: z.date({
          error: "Data deve ser uma data válida",
    }).optional().nullable(),
    quantity: z.number().int().min(1, "Quantidade deve ser ao menos 1 grama"),
  });
      

    const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0, 
      quantity: 1
    },
  })

function onSubmit(values: z.infer<typeof schema>) {
 
  const payload = {
    ...values,
    soldDate: values.soldDate.toISOString(),
    pgDate: values.pgDate ? values.pgDate.toISOString() : null,
    deliveredDate: values.deliveredDate ? values.deliveredDate.toISOString() : null,
  };

  fetch("/api/sale/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao criar venda");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Venda criada com sucesso:", data);
      form.reset();
    })
    .catch((err) => {
      console.error("Erro ao criar venda:", err.message);
      alert(err.message);
    });
}

  return (
    <div className="font-sans grid justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full max-w-4xl">
          <div className="flex flex-col gap-8 px-8">
            <div className="flex flex-row items-center gap-4 pt-4">
                <PlusCircle className="h-10 w-10"/>
                <h2 className="text-2xl font-bold">Adicionar Venda</h2>
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
                        value={field.value.toString()}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="customer"
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
                name="soldDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Data da Venda</FormLabel>
                    <FormControl>
                        <Input
                        type="date"
                        {...field}
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
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
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
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
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
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
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <Button type="submit">Adicionar Venda</Button>
      </form>
    </Form>
          </div>
      </main>
    </div>
  );
}
