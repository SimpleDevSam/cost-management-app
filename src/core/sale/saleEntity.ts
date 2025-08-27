import { Customer } from "../customer/customerEntity";

export interface Sale {
  readonly _id?: string;
  readonly customer: Customer;
  readonly amount: number;
  readonly quantity: number;
  readonly soldAt: Date;
  readonly pgDate: Date | null;
  readonly deliveredDate: Date | null;
  readonly isDeleted: boolean;
}