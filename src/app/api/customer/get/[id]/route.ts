import { CustomerRepository } from "@/core/customer/repository";
import { GetCustomer } from "@/core/customer/use-cases/getCustomer";
import {  NextRequest } from "next/server";


const handler = new GetCustomer(new CustomerRepository())

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  try{
    const id = (await params).id;

    if(!id) {
      throw new Error("ID do cliente é requerido");
    }

    const sale = await handler.execute(id)

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