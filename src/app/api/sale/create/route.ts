import { NextResponse } from "next/server";
import { CustomerRepository } from "../../../../core/customer/repository";
import z, { ZodError } from "zod";
import { CreateSale, CreateSaleDTO } from "@/core/sale/use-cases/createSale";
import { SaleRepository } from "@/core/sale/repository";

const createSale = new CreateSale( new SaleRepository(), new CustomerRepository());

const schema = z.object({
    amount: z.number().min(0, "Valor deve ser maior que zero"),
    soldDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ error: "Data deve ser uma data válida" })),
    customer: z.string({
      error: "Deve ser um nome válido",
    }),
    pgDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ error: "Data deve ser uma data válida" })).optional().nullable(),
    deliveredDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ error: "Data deve ser uma data válida" })).optional().nullable(),
    quantity: z.number().int().min(1, "Quantidade deve ser ao menos 1 grama"),
  });

export async function POST(req: Request) {
  const body = await req.json();
  const { amount, soldDate, customer, pgDate, deliveredDate, quantity } = body;

  try {
    await schema.parseAsync(body); 
  } catch (err : ZodError | any) {
    const error = z.prettifyError(err)
    return NextResponse.json({ error: error }, { status: 400 } );
  }

  try {
    const createSaleDTO : CreateSaleDTO = {
      amount,
      customerName: customer,
      pgDate,
      deliveredDate,
      soldAt: soldDate,
      quantity
    }

    const sale = await createSale.execute(createSaleDTO)
    
    return NextResponse.json(sale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}