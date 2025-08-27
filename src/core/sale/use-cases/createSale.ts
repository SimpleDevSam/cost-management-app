import { CustomerRepository } from "@/core/customer/repository";
import { SaleRepository } from "../repository";
import { Sale } from "../saleEntity";

export interface CreateSaleDTO {
  customerName: string;
  amount: number;
  pgDate: Date | null
  deliveredDate: Date | null
  soldAt: Date
  quantity: number
}

export class CreateSale {
    constructor(
    private saleRepo: SaleRepository,
    private customerRepo: CustomerRepository
  ) {}

  async execute(createSaleDTO: CreateSaleDTO) {
    
    const customerData = await this.customerRepo.findByName(createSaleDTO.customerName);

    if (!customerData) { 
      throw new Error('Customer not found');
    } 

    const customer = await this.saleRepo.create({
      customer:customerData,
      amount:createSaleDTO.amount,
      soldAt:createSaleDTO.soldAt,
      quantity:createSaleDTO.quantity,
      deliveredDate:createSaleDTO.deliveredDate,
      pgDate:createSaleDTO.pgDate,
      isDeleted:false
  });

    return customer;
  }
}