export interface Customer {
  _id:string;
  userId:string;
  name:string;
  totalSales:number;
  totalAmountSpent:number;
  createdAt:Date;
  updatedAt:Date;
  lastPurchase:Date |null;
}