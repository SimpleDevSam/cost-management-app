import { SaleRepository } from "@/core/sale/repository";
import { DeleteSale } from "@/core/sale/use-cases/deleteSale";
import { NextRequest } from "next/server";


const handler = new DeleteSale(new SaleRepository())

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  try{
    const id = (await params).id;

    if(!id) {
      throw new Error("ID da venda é requerido");
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