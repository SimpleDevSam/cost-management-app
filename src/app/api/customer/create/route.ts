import { NextResponse } from "next/server";
import { CreateCustomer } from "../../../../core/customer/use-cases/createCustomer";
import { CustomerRepository } from "../../../../core/customer/repository";
import z, { ZodError } from "zod";
import { requireUserId } from "@/lib/requireUser";

const createCustomer = new CreateCustomer(new CustomerRepository())

export const customerNameSchema = z.string()
  .min(2, "Precisa ter ao menos 2 caracteres")
  .max(50, "Precisa ter no máximo 50 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Apenas letras e espaços são permitidos");

export async function POST(req: Request) {
  const { name } = await req.json();
  try {
    await customerNameSchema.parseAsync(name); 
  } catch (err : ZodError | any) {
    const error = z.prettifyError(err)
    return NextResponse.json({ error: error }, { status: 400 } );
  }

  try {
    const userId = await requireUserId();
    const createCustomerDTO = { name:name, isDeleted:false, userId:userId };
    const sale = await createCustomer.execute(createCustomerDTO)
    return NextResponse.json(sale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}