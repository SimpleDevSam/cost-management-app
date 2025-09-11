import mongoose, { Schema, Document } from "mongoose";
import { CustomerModel } from "../customer/mongooseModel";


export interface SaleDocument extends Document {
  customer: mongoose.Types.ObjectId;
  userId:string;
  amount: number;
  pgDate: Date;
  soldAt: Date;
  deliveredDate: Date;
  quantity: number;
  isDeleted?:boolean;
}

const SaleSchema = new Schema<SaleDocument>({
  userId: { type: String, required: true, index: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  pgDate: { type: Date, default: null },
  soldAt: { type: Date, default: null },
  deliveredDate: { type: Date, default: null },
  quantity: { type: Number, required: true },
  isDeleted: { type: Boolean},
 }, { timestamps: true, strict: false });

export const SaleModel =
  mongoose.models.Sale || mongoose.model<SaleDocument>("Sale", SaleSchema);