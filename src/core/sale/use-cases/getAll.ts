import { GetAllSalesDTO } from "@/app/api/sale/getAll/route";
import { SaleRepository } from "../repository";

export class GetAllSalesWithCustomerName {
    constructor(
    private salesRepo: SaleRepository,
  ) {}

  async execute(userId:string) : Promise<GetAllSalesDTO[]> {
    const customers = await this.salesRepo.getAll(userId);
    return customers;
  }
}