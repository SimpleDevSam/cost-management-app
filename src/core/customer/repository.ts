import { Customer } from "./customerEntity";
import { CustomerModel } from "./mongooseModel";
import { CreateCustomerDTO } from "./use-cases/createCustomer";
import { connectDatabase } from "@/infra/database";

export class CustomerRepository {

  static async build(): Promise<CustomerRepository> {
    
    return new CustomerRepository();
  }
  
  async create(customer: CreateCustomerDTO): Promise<Customer> {
    await connectDatabase();
    const doc = await CustomerModel.create(customer);
    doc.save();
    return doc;
  }

  async getAll(userId:string): Promise<Customer[]> {
    await connectDatabase();
    return await CustomerModel.find({userId}).exec();
  }

  async markAsDeleted(customerId: string, userId:string): Promise<Customer> {
      await connectDatabase();
  
      let doc = await CustomerModel.findOneAndUpdate<Customer>({_id:customerId, userId}, {isDeleted:true}, ).exec();
  
      if (!doc){
        throw new Error('Usuário não encontrado para ser deletado.')
      }
    
      return doc;
  }

  async findById(id: string, userId:string): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findOne({_id:id, userId}).exec();
    if (!doc) return null;
    return doc
  }

  async update(customer: Customer): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findByIdAndUpdate({_id :customer._id, userId:customer.userId}, customer)
    if (!doc) return null;
    return doc
  }

  async findByName(customer: CreateCustomerDTO): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findOne({ name:customer.name, userId:customer.userId }).exec();
    if (!doc) return null;
    return doc;
  }
}
