import { NextResponse } from "next/server";
import { CustomerRepository } from "../../../../core/customer/repository";
import { GetAllCustomer } from "@/core/customer/use-cases/getAll";

const getAll = new GetAllCustomer(new CustomerRepository())

export async function GET(req: Request) {
  try {
    const customers = await getAll.execute()
    return NextResponse.json(customers, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}