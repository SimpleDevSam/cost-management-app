import { SaleRepository } from "@/core/sale/repository";
import { GetAllSalesWithCustomerName } from "@/core/sale/use-cases/getAll";
import { requireUserId } from "@/lib/requireUser";
import { NextResponse } from "next/server";


const getAll = new GetAllSalesWithCustomerName(new SaleRepository())

export interface GetAllSalesDTO
{
  _id: string
  customer: {_id:string, name:string}
  soldAt: Date
  amount:number
  quantity:number
  pgDate: Date | null
  deliveredDate: Date | null
}


export async function GET(req: Request) {
  
  const userId = await requireUserId();

  try {
    const sales = await getAll.execute(userId)
    return NextResponse.json(sales, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}