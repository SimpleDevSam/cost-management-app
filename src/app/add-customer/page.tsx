"use client";
import { Terminal, UserPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

export default function AddCustomer() {

const [isLoading, setIsLoading] =  useState(false)

const schema = z.object({
  userName: z.string().min(1, "Nome de usuário é obrigatório"),
});

const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "", 
    },
  })

async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/customer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.userName }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        return;
      }

      const data = await res.json();
      toast('✅ Cliente criado com sucesso!')
      form.reset();
    } catch (err) {
      toast('❌ Erro ao criar cliente!')
    } finally {
      setIsLoading(false)
    }
}

  return (
    <div className="font-sans grid items-start justify-items-center py-8 pb-20 gap-16 sm:p-20">
      <main className="">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center gap-4">
                <UserPlus className="h-10 w-10"/>
                <h2 className="text-2xl font-bold">Adicionar Cliente</h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        placeholder="Nome de Usuário"
                        value={field.value.trim()}
                        onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        <Button disabled={isLoading} type="submit">{isLoading ? 'Adicionando..' : 'Adicionar Cliente'}</Button>
      </form>
    </Form>
          </div>
      </main>
    </div>
  );
}