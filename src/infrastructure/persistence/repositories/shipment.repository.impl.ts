// src/infrastructure/persistence/repositories/shipment.repository.impl.ts

import { ShipmentRepository } from "../../../interfaces/repositories/shipment.repository.interface";
import {
  ShipmentDTO,
  CreateShipmentDTO,
} from "../../../application/dto/shipment.dto";
import { shipmentModel, ShipmentModel } from "../models/shipment.model";
import { ShipmentStatus } from "../../../interfaces/order/shipment.interface";

export class ShipmentRepositoryImpl implements ShipmentRepository {
  private shipmentModel: ShipmentModel;

  constructor() {
    this.shipmentModel = shipmentModel;
  }

  async create(shipment: CreateShipmentDTO): Promise<ShipmentDTO> {
    return await this.shipmentModel.create({
      ...shipment,
      status: ShipmentStatus.PENDING,
    });
  }

  async findById(id: number): Promise<ShipmentDTO | null> {
    return await this.shipmentModel.findById(id);
  }

  async findByTrackingNumber(
    trackingNumber: string
  ): Promise<ShipmentDTO | null> {
    return await this.shipmentModel.findByTrackingNumber(trackingNumber);
  }

  async findByUserId(userId: number,search:string): Promise<ShipmentDTO[]> {
    return await this.shipmentModel.findByUserId(userId,search);
  }

  async updateStatus(id: number, status: ShipmentStatus): Promise<boolean> {
    return await this.shipmentModel.updateStatus(id, status);
  }

  async delete(id: number): Promise<boolean> {
    return await this.shipmentModel.delete(id);
  }

  async findAll(): Promise<ShipmentDTO[]> {
    return await this.shipmentModel.findAll();
  }

  async initializeTable(): Promise<void> {
    await this.shipmentModel.createTable();
  }
}
