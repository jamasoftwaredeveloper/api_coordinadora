import { Address } from "../../interfaces/order/shipment.interface";

export interface AddressValidationService {
  validateAddress(address: Address): Promise<boolean>;
}