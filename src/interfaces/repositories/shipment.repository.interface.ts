import {
  CreateShipmentDTO,
  ShipmentDTO,
} from "../../application/dto/shipment.dto";
import { Filter, ShipmentStatus } from "../order/shipment.interface";
import { TransporterEntity } from "../transporter/transporter.interface";

export interface ShipmentRepository {
  create(shipment: CreateShipmentDTO): Promise<ShipmentDTO>;
  findById(id: number): Promise<ShipmentDTO | null>;
  findByTrackingNumber(trackingNumber: string): Promise<ShipmentDTO | null>;
  findByUserId(
    userId: number,
    search: Filter
  ): Promise<Omit<ShipmentDTO[] | null, "createdAt" | "updatedAt">>;
  updateStatus(id: number, status: ShipmentStatus): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<ShipmentDTO[]>;
  getTransporterPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any>;
  getRoutePerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any>;
  getMonthlyPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any>;

  storeTransporter(
    data: Omit<
      TransporterEntity,
      "id" | "created_at" | "updated_at" | "available"
    >
  ): Promise<
    Omit<TransporterEntity, "created_at" | "updated_at" | "available">
  >;
}
