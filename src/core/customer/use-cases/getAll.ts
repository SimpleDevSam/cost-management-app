import { Customer } from "../customerEntity";
import { CustomerRepository } from "../repository";

export interface CreateCustomerDTO {
  name: string;
}

export class GetAllCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute(userId:string) : Promise<Customer[]> {
    const customers = await this.customerRepo.getAll(userId);
    return customers;
  }
}