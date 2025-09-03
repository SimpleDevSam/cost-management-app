import { CustomerRepository } from "../repository";

export interface CreateCustomerDTO {
  name: string;
}

export class CreateCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute(createCustomerDTO: CreateCustomerDTO) {

    const hasCustomer = await this.customerRepo.findByName(createCustomerDTO.name);

    if (hasCustomer) {
      throw new Error("Customer already exists");
    }

    const customer = await this.customerRepo.create(createCustomerDTO);
    return customer;
  }
}