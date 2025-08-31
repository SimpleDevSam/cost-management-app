import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { CustomerRepository } from "@/core/customer/repository";
import { EditCustomer, EditCustomerDTO } from "@/core/customer/use-cases/editCustomer";

const editCustomer = new EditCustomer( new CustomerRepository());

const schema = z.object({
    name: z.string({
      error: "Deve ser um nome válido",
    })
  });

export async function PATCH(req: Request , { params }: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  const id = (await params).id;

  if (!id) {
    throw new Error('Usuário não encontrado')
  }

  const { name } = body;

  try {
    await schema.parseAsync(body); 
  } catch (err : ZodError | any) {
    const error = z.prettifyError(err)
    return NextResponse.json({ error: error }, { status: 400 } );
  }

  try {
    const editSaleDTO : EditCustomerDTO = {
      _id:id,
      name
    }
    
    const sale = await editCustomer.execute(editSaleDTO)

    return NextResponse.json(sale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}