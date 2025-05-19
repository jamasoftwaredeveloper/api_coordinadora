// src/infrastructure/persistence/repositories/shipment.repository.impl.ts

import { ShipmentRepository } from "../../../interfaces/repositories/shipment.repository.interface";
import {
  ShipmentDTO,
  CreateShipmentDTO,
} from "../../../application/dto/shipment.dto";
import { shipmentModel, ShipmentModel } from "../models/shipment.model";
import {
  Filter,
  ShipmentStatus,
} from "../../../interfaces/order/shipment.interface";
import {
  transporterMetricsModel,
  TransporterMetricsModel,
} from "../models/transporterMetrics.model";

export class ShipmentRepositoryImpl implements ShipmentRepository {
  private shipmentModel: ShipmentModel;
  private transporterMetricsModel: TransporterMetricsModel;

  constructor() {
    this.shipmentModel = shipmentModel;
    this.transporterMetricsModel = transporterMetricsModel;
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

  async findByUserId(userId: number, search: Filter): Promise<ShipmentDTO[]> {
    return await this.shipmentModel.findByUserId(userId, search);
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

  async getTransporterPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    return await this.transporterMetricsModel.getTransporterPerformanceMetrics(
      new Date(parameters.startDate),
      new Date(parameters.endDate)
    );
  }

  async getRoutePerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    return await this.transporterMetricsModel.getRoutePerformanceMetrics(
      new Date(parameters.startDate),
      new Date(parameters.endDate)
    );
  }

  async getMonthlyPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    return await this.transporterMetricsModel.getMonthlyPerformanceMetrics(
      new Date(parameters.startDate),
      new Date(parameters.endDate)
    );
  }
}
