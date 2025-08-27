import { CustomerRepository } from "../repository";

export interface CreateCustomerDTO {
  name: string;
}

export class CreateCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute(createCustomerDTO: CreateCustomerDTO) {
    console.log("Creating customer with name:", createCustomerDTO.name);

    const hasCustomer = await this.customerRepo.findByName(createCustomerDTO.name);
    console.log("After hasCustomer", createCustomerDTO.name);

    if (hasCustomer) {
      throw new Error("Customer already exists");
    }

    const customer = await this.customerRepo.create(createCustomerDTO);
    return customer;
  }
}