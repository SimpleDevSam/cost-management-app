import { CustomerRepository } from "@/core/customer/repository";

export interface EditCustomerDTO {
    readonly _id:string;
    readonly name: string;
    readonly userId:string;
  }

export class EditCustomer {
    constructor(
    private customerRepo: CustomerRepository
  ) {}

  async execute(editCustomerDTO: EditCustomerDTO) {
    
    if (editCustomerDTO.name === null || editCustomerDTO.name === ''){
      throw new Error('Usuário não encontrado ao realizar edição.')
    }

    const customer = await this.customerRepo.findById(editCustomerDTO._id, editCustomerDTO.userId)

    if (!customer){
      throw new Error('Usuário não encontrado')
    }

    customer.name = editCustomerDTO.name

    await this.customerRepo.update(customer)

    return customer;
  }
}