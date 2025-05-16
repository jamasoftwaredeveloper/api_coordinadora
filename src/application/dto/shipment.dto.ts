// src/application/dto/shipment.dto.ts

import {
  Address,
  PackageInfo,
  ShipmentStatus,
} from "../../interfaces/order/shipment.interface";

export interface CreateShipmentDTO {
  userId: number;
  packageInfo: PackageInfo;
  destinationAddress: Address;
  exitAddress: Address;
}

export interface ShipmentDTO {
  id?: number;
  userId: number;
  packageInfo: PackageInfo;
  exitAddress: Address;
  destinationAddress: Address;
  status: ShipmentStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentResponseDTO {
  id: number;
  trackingNumber: string;
  status: ShipmentStatus;
  estimatedDeliveryDate?: Date;
  cost: number;
  message: string;
}
