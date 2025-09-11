import { connectDatabase } from "@/infra/database";
import { SaleModel } from "./mongooseModel";
import { Sale } from "./saleEntity";
import { GetAllSalesDTO } from "@/app/api/sale/getAll/route";
import { EditSaleDTO } from "./use-cases/editSale";
import { CustomerModel } from "../customer/mongooseModel";


// TODO:this line is preventing the "customer not defined" error, need to understand a better way to do this.
const CustomerSchema = CustomerModel.schema;

export class SaleRepository {
  async create(sale: Sale): Promise<Sale> {
    await connectDatabase();
    const doc = await SaleModel.create({
      amount: sale.amount,
      pgDate: sale.pgDate,
      deliveredDate: sale.deliveredDate,
      customer: sale.customer._id,
      quantity: sale.quantity,
      soldAt: sale.soldAt,
      isDeleted:false,
      userId:sale.userId
    });

    doc.save();
    return doc
  }

  async findByCustomerId(customerId: string): Promise<Sale[]> {
    await connectDatabase();
    const docs = await SaleModel.find({ customerId }).exec();
    return docs;
  }

  async findOneByCustomerIdAndUserId(customerId: string, userId:string): Promise<Sale | null> {
    await connectDatabase();
    const docs = await SaleModel.findOne({customerId, isDeleted:false, userId}).exec();
    return docs;
  }

  async editSale(sale: EditSaleDTO): Promise<Sale> {
    await connectDatabase();
    const doc = await SaleModel.findOneAndUpdate(
      {_id:sale._id, userId:sale.userId}, sale).exec();
    return doc;
  }

  async markAsDeleted(saleId: string): Promise<Sale> {
    await connectDatabase();

    let doc = await SaleModel.findOneAndUpdate<Sale>({_id:saleId}, {isDeleted:true}).exec();

    if (!doc){
      throw new Error('Venda não encontrada pala ser deletada.')
    }
  
    return doc;
  }

  async getSaleById(saleId: string, userId:string): Promise<Sale | null> {
    await connectDatabase();
    const doc  = await SaleModel.findOne({ _id : saleId, userId:userId }).populate('customer').exec()

    return doc
  }

  async getAll(userId:string): Promise<GetAllSalesDTO[]> {
      await connectDatabase();
      return await SaleModel.find({isDeleted:false, userId}).populate('customer').exec();
    }

}