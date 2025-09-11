import { CustomerRepository } from "@/core/customer/repository";
import { SaleRepository } from "../repository";
import { Sale } from "../saleEntity";
import { requireUserId } from "@/lib/requireUser";

export interface CreateSaleDTO {
  name: string;
  amount: number;
  pgDate: Date | null
  deliveredDate: Date | null
  soldAt: Date
  quantity: number
  userId:string
}

export class CreateSale {
    constructor(
    private saleRepo: SaleRepository,
    private customerRepo: CustomerRepository
  ) {}

  async execute(createSaleDTO: CreateSaleDTO) {
    const userId = await requireUserId();

    const customer = await this.customerRepo.findByName(createSaleDTO);

    if (!customer) { 
      throw new Error('Customer not found');
    } 

    const sale = await this.saleRepo.create({
      customer:customer,
      amount:createSaleDTO.amount,
      soldAt:createSaleDTO.soldAt,
      quantity:createSaleDTO.quantity,
      deliveredDate:createSaleDTO.deliveredDate,
      pgDate:createSaleDTO.pgDate,
      isDeleted:false,
      userId
    });

    customer.totalSales += 1
    customer.totalAmountSpent += createSaleDTO.amount
    customer.lastPurchase = new Date()

    await this.customerRepo.update(customer)

    return sale;
  }
}