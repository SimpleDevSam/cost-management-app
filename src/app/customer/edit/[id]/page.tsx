"use client";
import { Pencil} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Customer } from "@/core/customer/customerEntity";
import router from "next/router";

export default function AddCustomer({ params }: { params: Promise<{ id: string }>}) {
const [customer, setCustomer] = useState<Customer | null >(null)
const resolvedParams = use(params)

const schema = z.object({
  customerName: z.string().min(1, "Nome de usuário é obrigatório"),
});

const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: '', 
    },
  })

useEffect( () =>{

  const fetchCustomer = async () => {

    if(!resolvedParams.id) {
      return;
    }

    const data = await fetch(`/api/customer/get/${resolvedParams.id}`)
    const customer = await data.json()
    setCustomer(customer)

    if (!customer) {
      alert("Sale not found")
      router.push('/customers');
      return;
    }

    form.setValue('customerName', customer.name)
    }

    fetchCustomer()
}, [resolvedParams])

async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const res = await fetch(`/api/customer/edit/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.customerName }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast(`❌ ${error.message}`)
        return;
      }

      const data = await res.json();
      toast('✅ Cliente editado com sucesso!')
    } catch (err) {
      toast('❌ Erro ao editar cliente!')
    }
}

  return (
    <div className="font-sans grid items-start justify-items-center py-8 pb-20 gap-16 sm:p-20">
      <main className="">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-4">
                <Pencil className="h-10 w-10"/>
                <h2 className="text-2xl font-bold">Editar Cliente</h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        placeholder="Nome do Cliente"
                        value={field.value}
                        onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        <Button type="submit">Editar Cliente</Button>
      </form>
    </Form>
          </div>
      </main>
    </div>
  );
}