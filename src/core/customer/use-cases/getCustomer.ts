import { Customer } from "../customerEntity";
import { CustomerRepository } from "../repository";

export class GetCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute(customerId: string) : Promise<Customer> {

    const customer = await this.customerRepo.findById(customerId);

    if(!customer) {
      throw new Error("Sale not found");
    }
    
    return customer
  }
}