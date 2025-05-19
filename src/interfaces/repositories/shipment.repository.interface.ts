import { CreateShipmentDTO, ShipmentDTO } from "../../application/dto/shipment.dto";
import { ShipmentStatus } from "../order/shipment.interface";

export interface ShipmentRepository {
  create(shipment: CreateShipmentDTO): Promise<ShipmentDTO>;
  findById(id: number): Promise<ShipmentDTO | null>;
  findByTrackingNumber(trackingNumber: string): Promise<ShipmentDTO | null>;
  findByUserId(userId: number, search:object): Promise<Omit<ShipmentDTO[] | null, "createdAt" | "updatedAt">>;
  updateStatus(id: number, status: ShipmentStatus): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<ShipmentDTO[]>;
}