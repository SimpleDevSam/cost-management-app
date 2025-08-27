import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { SaleRepository } from "@/core/sale/repository";
import { CustomerRepository } from "@/core/customer/repository";
import { EditSale, EditSaleDTO } from "@/core/sale/use-cases/editSale";

const editCustomer = new EditSale( new SaleRepository(), new CustomerRepository());

const schema = z.object({
    amount: z.number().min(0, "Valor deve ser maior que zero"),
    soldAt: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ error: "Data deve ser uma data válida" })),
    customerName: z.string({
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

export async function PATCH(req: Request , { params }: { params: { id: string }}) {
  const body = await req.json();
  const id = (await params).id;
  const { amount, soldAt, customer, pgDate, deliveredDate, quantity } = body;

  try {
    await schema.parseAsync(body); 
  } catch (err : ZodError | any) {
    const error = z.prettifyError(err)
    return NextResponse.json({ error: error }, { status: 400 } );
  }

  try {
    const editSaleDTO : EditSaleDTO = {
      _id:id,
      amount,
      customer,
      pgDate,
      deliveredDate,
      soldAt,
      quantity
    }
    const sale = await editCustomer.execute(editSaleDTO)
    return NextResponse.json(sale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}