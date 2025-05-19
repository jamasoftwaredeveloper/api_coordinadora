import { RowDataPacket } from "mysql2";
import { RouteDTO } from "../../application/dto/route.dto";
import { TransporterDTO } from "../../application/dto/transporter.dto";

export interface RouteEntity {
  id: number;
  name: string;
  vehicle_capacity: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para los resultados de la tabla de rutas
export interface RouteRow
  extends RowDataPacket,
    Omit<RouteDTO, "createdAt" | "updatedAt"> {
  created_at: Date;
  updated_at: Date;
}

// Interfaz para los resultados de la tabla de transportistas
export interface TransporterRow
  extends RowDataPacket,
    Omit<TransporterDTO, "createdAt" | "updatedAt"> {
  created_at: Date;
  updated_at: Date;
}
