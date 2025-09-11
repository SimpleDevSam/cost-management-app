import { CustomerRepository } from "../repository";

export interface CreateCustomerDTO {
  name: string;
  userId:string;
}

export class CreateCustomer {
    constructor(
    private customerRepo: CustomerRepository,
  ) {}

  async execute(createCustomerDTO: CreateCustomerDTO) {

    const hasCustomer = await this.customerRepo.findByName(createCustomerDTO);

    if (hasCustomer) {
      throw new Error("Cliente já existe");
    }

    const customer = await this.customerRepo.create(createCustomerDTO);
    return customer;
  }
}