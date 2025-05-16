// src/infrastructure/persistence/models/shipment.model.ts

import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { ShipmentDTO } from "../../../application/dto/shipment.dto";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";
import { ShipmentStatus } from "../../../interfaces/order/shipment.interface";

// Interfaces para tipar los resultados
interface ShipmentRow
  extends RowDataPacket,
    Omit<ShipmentDTO, "packageInfo" | "destinationAddress"> {
  package_info: string; // JSON string
  destination_address: string; // JSON string
}

export class ShipmentModel {
  private pool: Pool;

  constructor() {
    this.pool = getDbPool();
  }

  // Crear la tabla de envíos si no existe
  public async createTable(): Promise<ResultSetHeader> {
    const sql = `
      CREATE TABLE IF NOT EXISTS shipments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT DEFAULT NULL,
        transporter_id INT DEFAULT NULL,
        user_id INT NOT NULL,
        package_info JSON NOT NULL,
        exit_address JSON NOT NULL,
        destination_address JSON NOT NULL,
        status VARCHAR(50) NOT NULL,
        tracking_number VARCHAR(100),
        estimated_delivery_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (route_id) REFERENCES routes(id),
        FOREIGN KEY (transporter_id) REFERENCES transporters(id)
      )
    `;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql);
      return result;
    } catch (error) {
      throw new DatabaseError("Error creating shipments table", error);
    }
  }

  // Crear un nuevo envío
  public async create(shipmentData: ShipmentDTO): Promise<ShipmentDTO> {
    const {
      userId,
      packageInfo,
      destinationAddress,
      exitAddress,
      status,
      trackingNumber,
      estimatedDeliveryDate,
    } = shipmentData;

    const sql = `
      INSERT INTO shipments 
      (user_id, package_info, exit_address, destination_address, status, tracking_number, estimated_delivery_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [
        userId,
        JSON.stringify(packageInfo),
        JSON.stringify(destinationAddress),
        JSON.stringify(exitAddress),
        status,
        trackingNumber,
        estimatedDeliveryDate,
      ]);

      return {
        ...shipmentData,
        id: result.insertId,
      };
    } catch (error) {
      throw new DatabaseError("Error creating shipment", error);
    }
  }

  // Encontrar envío por ID
  public async findById(id: number): Promise<ShipmentDTO | null> {
    const sql = `SELECT * FROM shipments WHERE id = ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [id]);

      if (!rows[0]) return null;

      const shipment = rows[0];

      return {
        id: shipment.id,
        userId: shipment.user_id,
        packageInfo:this.safeParse(shipment.package_info),
        destinationAddress:this.safeParse(shipment.destination_address),
        exitAddress:this.safeParse(shipment.exit_address),
        status: shipment.status as ShipmentStatus,
        trackingNumber: shipment.tracking_number,
        estimatedDeliveryDate: shipment.estimated_delivery_date,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
      };
    } catch (error) {
      throw new DatabaseError("Error finding shipment by ID", error);
    }
  }

  // Encontrar envío por número de seguimiento
  public async findByTrackingNumber(
    trackingNumber: string
  ): Promise<ShipmentDTO | null> {
    const sql = `SELECT * FROM shipments WHERE tracking_number = ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [
        trackingNumber,
      ]);

      if (!rows[0]) return null;

      const shipment = rows[0];

      // Verificar si ya son objetos para evitar JSON.parse innecesario

      return {
        id: shipment.id,
        userId: shipment.user_id,
        packageInfo: this.safeParse(shipment.package_info),
        destinationAddress: this.safeParse(shipment.destination_address),
        exitAddress: this.safeParse(shipment.exit_address),
        status: shipment.status as ShipmentStatus,
        trackingNumber: shipment.tracking_number,
        estimatedDeliveryDate: shipment.estimated_delivery_date,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
      };
    } catch (error) {
      throw new DatabaseError(
        "Error finding shipment by tracking number",
        error
      );
    }
  }

  // Encontrar envíos por ID de usuario
  public async findByUserId(userId: number): Promise<ShipmentDTO[]> {
    console.log(`Finding shipments for user ID: ${userId}`);

    const sql = `SELECT * FROM shipments WHERE user_id = ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [userId]);

      return rows.map((shipment) => ({
        id: shipment.id,
        userId: shipment.user_id,
        packageInfo: this.safeParse(shipment.package_info),
        destinationAddress: this.safeParse(shipment.destination_address),
        exitAddress: this.safeParse(shipment.exit_address),
        status: shipment.status as ShipmentStatus,
        trackingNumber: shipment.tracking_number,
        estimatedDeliveryDate: shipment.estimated_delivery_date,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
      }));
    } catch (error) {
      throw new DatabaseError("Error finding shipments by user ID", error);
    }
  }

  // Método auxiliar para parsear JSON de manera segura
  private safeParse(data: string | null): any {
    if (!data) return null;
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("Error parsing JSON:", data, error);
      return null;
    }
  }

  // Actualizar estado del envío
  public async updateStatus(
    id: number,
    status: ShipmentStatus
  ): Promise<boolean> {
    const sql = `UPDATE shipments SET status = ? WHERE id = ?`;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [
        status,
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Error updating shipment status", error);
    }
  }

  // Eliminar envío
  public async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM shipments WHERE id = ?`;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Error deleting shipment", error);
    }
  }

  // Listar todos los envíos
  public async findAll(): Promise<ShipmentDTO[]> {
    const sql = `SELECT * FROM shipments`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql);

      return rows.map((shipment) => ({
        id: shipment.id,
        userId: shipment.user_id,
        packageInfo: this.safeParse(shipment.package_info),
        destinationAddress: this.safeParse(shipment.destination_address),
        exitAddress: this.safeParse(shipment.exit_address),
        status: shipment.status as ShipmentStatus,
        trackingNumber: shipment.tracking_number,
        estimatedDeliveryDate: shipment.estimated_delivery_date,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
      }));
    } catch (error) {
      throw new DatabaseError("Error finding all shipments", error);
    }
  }
}

// Exportar una instancia del modelo
export const shipmentModel = new ShipmentModel();
