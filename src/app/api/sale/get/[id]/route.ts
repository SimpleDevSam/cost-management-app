import { SaleRepository } from "@/core/sale/repository";
import { GetSale } from "@/core/sale/use-cases/getSale";
import { requireUserId } from "@/lib/requireUser";
import { NextRequest } from "next/server";


const handler = new GetSale(new SaleRepository())

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const userId = await requireUserId();
  
  try{
    
    const id = (await params).id;

    if(!id) {
      throw new Error("Sale ID é requerido");
    }

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