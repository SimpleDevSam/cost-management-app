import { CustomerRepository } from "@/core/customer/repository";
import { SaleRepository } from "../repository";
import { Customer } from "@/core/customer/customerEntity";

export interface EditSaleDTO {
    readonly _id?: string;
    readonly customerName?: string;
    readonly customer?: Customer;
    readonly soldAt?: Date;
    readonly pgDate?: Date | null;
    readonly deliveredDate?: Date | null;
    readonly isDeleted?: boolean;
  }


export class EditSale {
    constructor(
    private saleRepo: SaleRepository,
    private customerRepo: CustomerRepository
  ) {}

  async execute(editSaleDTO: EditSaleDTO) {

    console.log(JSON.stringify(editSaleDTO))
    
    if (editSaleDTO.customerName === null || editSaleDTO.customerName === undefined){
      throw new Error('Usuário não encontrado ao realizar edição.')
    }

    const customerData = await this.customerRepo.findByName(editSaleDTO.customerName);

    if (!customerData) { 
      throw new Error('Customer not found');
    } 

    const customer = await this.saleRepo.editSale(
      {
        _id:editSaleDTO._id,
        soldAt:editSaleDTO.soldAt,
        customer:customerData,
        deliveredDate:editSaleDTO.deliveredDate,
        pgDate:editSaleDTO.pgDate,
        }     

    )
    return customer;
  }
}