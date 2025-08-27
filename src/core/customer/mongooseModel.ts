
import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
  name: string;
  totalSales?: number;
  totalAmountSpent?: number;
}

const CustomerSchema = new Schema<CustomerDocument>({
  name: { type: String, required: true },
  totalSales: { type: Number, default: 0 },
  totalAmountSpent: { type: Number, default: 0 },
}, { timestamps: true});

export const CustomerModel =
  mongoose.models.Customer || mongoose.model<CustomerDocument>("Customer", CustomerSchema);
