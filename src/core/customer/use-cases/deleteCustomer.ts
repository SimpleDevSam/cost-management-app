import { CustomerRepository } from "@/core/customer/repository";
import { Customer } from "../customerEntity";
import { SaleRepository } from "@/core/sale/repository";

export class DeleteCustomer {
    constructor(
    private customerRepo:CustomerRepository,
    private saleRepo:SaleRepository
  ) {}

  async execute(customerId: string, userId:string) : Promise<Customer> {

    const customerSales = await this.saleRepo.findOneByCustomerIdAndUserId(customerId, userId)

    if (customerSales){
      throw new Error ("Não foi possível deletar o usuário pois ele possui vendas ativas.")
    }

    const customer = await this.customerRepo.markAsDeleted(customerId, userId);

    await this.customerRepo.update(customer, userId)
    
    return customer
  }
}