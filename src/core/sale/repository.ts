import { connectDatabase } from "@/infra/database";
import { SaleDocument, SaleModel } from "./mongooseModel";
import { Sale } from "./saleEntity";
import { GetAllSalesDTO } from "@/app/api/sale/getAll/route";
import { EditSaleDTO } from "./use-cases/editSale";

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
    });

    doc.save();
    return doc
  }

  async findByCustomerId(customerId: string): Promise<Sale[]> {
    await connectDatabase();
    const docs = await SaleModel.find({ customerId }).exec();
    return docs;
  }

  async editSale(sale: EditSaleDTO): Promise<Sale> {
    await connectDatabase();
    const doc = await SaleModel.findOneAndUpdate(
      {_id:sale._id}, sale).exec();
    return doc;
  }

  async markAsDeleted(sale: Sale): Promise<Sale> {
    await connectDatabase();

    let doc = await SaleModel.findOneAndUpdate<Sale>({_id:sale._id}, {isDeleted:true}).exec();

    if (!doc){
      throw new Error('Venda não encontrada pala ser deletada.')
    }
  
    return doc;
  }

  async getSaleById(saleId: string): Promise<Sale | null> {
    await connectDatabase();
    const doc  = await SaleModel.findOne({ _id : saleId }).populate('customer').exec()

    return doc
  }

  async getAll(): Promise<GetAllSalesDTO[]> {
      await connectDatabase();
      return await SaleModel.find().populate('customer').exec();
    }

}