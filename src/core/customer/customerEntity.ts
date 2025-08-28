export interface Customer {
  _id:string;
  name:string;
  totalSales:number;
  totalAmountSpent:number;
  createdAt:Date;
  updatedAt:Date;
  lastPurchase:Date |null;
}