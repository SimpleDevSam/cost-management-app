import { SaleRepository } from "../repository";
import { Sale } from "../saleEntity";

export class GetSale {
    constructor(
    private salesRepo: SaleRepository,
  ) {}

  async execute(saleId: string, userId:string) : Promise<Sale> {

    const sale = await this.salesRepo.getSaleById(saleId, userId);

    if(!sale) {
      throw new Error("Sale not found");
    }
    
    return sale
  }
}