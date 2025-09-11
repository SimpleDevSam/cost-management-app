import { CustomerRepository } from "@/core/customer/repository";
import { SaleRepository } from "@/core/sale/repository";
import { DeleteSale } from "@/core/sale/use-cases/deleteSale";
import { requireUserId } from "@/lib/requireUser";
import { NextRequest } from "next/server";


const handler = new DeleteSale(new SaleRepository(), new CustomerRepository())

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string, customerId:string }> }) {
  const userId = await requireUserId();
  
  try{
    const {id, customerId} = (await params);

    if(!id || !customerId) {
      throw new Error("ID da venda/usuário é requerido");
    }

    const sale = await handler.execute(id, customerId, userId)

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