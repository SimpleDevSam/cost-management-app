import { Customer } from "../customerEntity";
import { CustomerRepository } from "../repository";

export interface CreateCustomerDTO {
  name: string;
}

export class GetAllCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute() : Promise<Customer[]> {
    const customers = await this.customerRepo.getAll();
    return customers;
  }
}