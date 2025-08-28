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

  async getAll(): Promise<Customer[]> {
    await connectDatabase();
    return await CustomerModel.find().exec();
  }

  async findById(id: string): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findById(id).exec();
    if (!doc) return null;
    return doc
  }

  async update(customer: Customer): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findByIdAndUpdate({_id :customer._id}, customer)
    if (!doc) return null;
    return doc
  }

  async findByName(name: string): Promise<Customer | null> {
    await connectDatabase();
    const doc = await CustomerModel.findOne({ name }).exec();
    if (!doc) return null;
    return doc;
  }
}
