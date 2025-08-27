import mongoose, { Schema, Document } from "mongoose";

export interface SaleDocument extends Document {
  customer: mongoose.Types.ObjectId;
  amount: number;
  pgDate: Date;
  soldAt: Date;
  deliveredDate: Date;
  quantity: number;
}

const SaleSchema = new Schema<SaleDocument>({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  pgDate: { type: Date, default: null },
  soldAt: { type: Date, default: null },
  deliveredDate: { type: Date, default: null },
  quantity: { type: Number, required: true },
 }, { timestamps: true, strict: false });

export const SaleModel =
  mongoose.models.Sale || mongoose.model<SaleDocument>("Sale", SaleSchema);