import { CustomerRepository } from "@/core/customer/repository";
import { GetCustomer } from "@/core/customer/use-cases/getCustomer";
import { requireUserId } from "@/lib/requireUser";
import {  NextRequest } from "next/server";


const handler = new GetCustomer(new CustomerRepository())

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try{
    const id = (await params).id;

    if(!id) {
      throw new Error("ID do cliente é requerido");
    }

    const userId = await requireUserId();

    const sale = await handler.execute(id, userId)

    return  new Response(JSON.stringify(sale), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify(err.message),{
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      })
  }
}