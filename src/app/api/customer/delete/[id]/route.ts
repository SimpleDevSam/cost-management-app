import { CustomerRepository } from "@/core/customer/repository";
import { DeleteCustomer } from "@/core/customer/use-cases/deleteCustomer";
import { SaleRepository } from "@/core/sale/repository";
import { requireUserId } from "@/lib/requireUser";
import { NextRequest } from "next/server";

const handler = new DeleteCustomer(new CustomerRepository(), new SaleRepository());

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      throw new Error("ID do usuário é requerido");
    }

    const userId = await requireUserId();

    const customer = await handler.execute(id, userId);

    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}