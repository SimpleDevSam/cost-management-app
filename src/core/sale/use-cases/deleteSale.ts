import { CustomerRepository } from "@/core/customer/repository";
import { SaleRepository } from "../repository";
import { Sale } from "../saleEntity";

export class DeleteSale {
    constructor(
    private salesRepo: SaleRepository,
    private customerRepo:CustomerRepository
  ) {}

  async execute(saleId: string, customerId:string) : Promise<Sale> {

    const sale = await this.salesRepo.markAsDeleted(saleId);

    if(!sale) {
      throw new Error("Venda não encontrada");
    }

    const customer = await this.customerRepo.findById(customerId)

    if (!customer){
      throw new Error("Usuário não encontrado");
    }

    customer.totalAmountSpent -= sale.amount
    customer.totalSales -= 1

    await this.customerRepo.update(customer)
    
    return sale
  }
}