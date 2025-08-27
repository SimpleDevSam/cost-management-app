import { SaleRepository } from "../repository";
import { Sale } from "../saleEntity";

export class DeleteSale {
    constructor(
    private salesRepo: SaleRepository,
  ) {}

  async execute(saleId: string) : Promise<Sale> {

    const sale = await this.salesRepo.markAsDeleted(saleId);

    if(!sale) {
      throw new Error("Sale not found");
    }
    
    return sale
  }
}