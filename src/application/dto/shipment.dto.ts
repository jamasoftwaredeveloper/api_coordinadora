// src/application/dto/shipment.dto.ts

import {
  Address,
  PackageInfo,
  ShipmentStatus,
} from "../../interfaces/order/shipment.interface";

export interface ShipmentDTO {
  id?: number;
  userId: number;
  routeId?: number;
  transporterId?: number;
  packageInfo: PackageInfo;
  exitAddress: Address;
  destinationAddress: Address;
  status: ShipmentStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CreateShipmentDTO
  extends Pick<
    ShipmentDTO,
    "userId" | "packageInfo" | "destinationAddress" | "exitAddress"
  > {}

export interface ShipmentResponseDTO
  extends Pick<ShipmentDTO, "id" | "status" | "estimatedDeliveryDate"> {
  cost: number;
  message: string;
}

export interface AssingShipmentDTO
  extends Pick<ShipmentDTO, "id" | "routeId" | "transporterId"> {}
