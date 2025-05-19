// src/infrastructure/persistence/models/shipment.model.ts

import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ShipmentDTO } from "../../../application/dto/shipment.dto";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";
import {
  Filter,
  ShipmentRow,
  ShipmentStatus,
  ShipmentWithRouteInfo,
} from "../../../interfaces/order/shipment.interface";
import { IShipmentRepository } from "../../../domain/repositories/IShipmentRepository";
import {
  mapRowToShipmentDTO,
  mapRowToShipmentWithRouteInfo,
} from "../../../utils/shipment";

// Interfaces para tipar los resultados

/**
 * Implementación del repositorio de envíos usando MySQL
 */
export class ShipmentModel implements IShipmentRepository {
  private readonly pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || getDbPool();
  }

  /**
   * Crea un nuevo envío en la base de datos
   */
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
        JSON.stringify(exitAddress),
        JSON.stringify(destinationAddress),
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

  /**
   * Busca un envío por su ID
   */
  public async findById(id: number): Promise<ShipmentDTO | null> {
    const sql = `SELECT * FROM shipments WHERE id = ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [id]);

      if (rows.length === 0) return null;

      return mapRowToShipmentDTO(rows[0]);
    } catch (error) {
      throw new DatabaseError("Error finding shipment by ID", error);
    }
  }

  /**
   * Busca un envío por su número de seguimiento
   */
  public async findByTrackingNumber(
    trackingNumber: string
  ): Promise<ShipmentDTO | null> {
    const sql = `SELECT * FROM shipments WHERE tracking_number = ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [
        trackingNumber,
      ]);

      if (rows.length === 0) return null;

      return mapRowToShipmentDTO(rows[0]);
    } catch (error) {
      throw new DatabaseError(
        "Error finding shipment by tracking number",
        error
      );
    }
  }

  /**
   * Busca envíos por ID de usuario aplicando filtros opcionales con paginación
   * @param userId ID del usuario
   * @param parameters Filtros opcionales
   * @param page Número de página (empieza desde 1)
   * @param pageSize Cantidad de registros por página
   */
  public async findByUserId(
    userId: number,
    parameters: Filter
  ): Promise<ShipmentWithRouteInfo[]> {
    // 1. Obtener el usuario y su rol
    const [userRows] = await this.pool.execute<RowDataPacket[]>(
      "SELECT id, role FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      throw new Error(`User with id ${userId} not found`);
    }
  
    const user = userRows[0];
    const { role } = user;

    const {
      search,
      status,
      route_id,
      transporter_id,
      startDate,
      endDate,
      page,
      pageSize,
    } = parameters;

    // Construimos la consulta base
    let sql = `
    SELECT s.*, t.name as transporter, r.name as route
    FROM shipments s
    LEFT JOIN routes r ON s.route_id = r.id
    LEFT JOIN transporters t ON s.transporter_id = t.id
    WHERE 1=1
  `;

    const conditions: string[] = [];
    const values: any[] = [];

    // Si no es admin, filtramos por user_id
    if (role !== "admin") {
      conditions.push("s.user_id = ?");
      values.push(userId);
    }
    const pageNumber = Number(parameters.page) || 1;
    const pageSizeNumber = Number(parameters.pageSize) || 10;
    // Añadimos condiciones según los filtros proporcionados
    this.applyFilters(conditions, values, {
      search,
      status,
      route_id,
      transporter_id,
      startDate,
      endDate,
    });
    // Añadimos las condiciones a la consulta SQL
    if (conditions.length) {
      sql += " AND " + conditions.join(" AND ");
    }

    // Paginación: calcular offset y limitar resultados
    const offset = (pageNumber - 1) * pageSizeNumber;
    const limit = pageSizeNumber;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, values);
      return rows.map((row) => mapRowToShipmentWithRouteInfo(row));
    } catch (error) {
      throw new DatabaseError(
        "Error finding shipments by user ID with pagination",
        error
      );
    }
  }
  // Métodos privados de ayuda

  /**
   * Aplica filtros a la consulta SQL
   */
  private applyFilters(
    conditions: string[],
    values: any[],
    filters: Filter
  ): void {
    const { search, status, route_id, transporter_id, startDate, endDate } =
      filters;

    if (search) {
      conditions.push("s.tracking_number = ?");
      values.push(search);
    }

    if (status) {
      conditions.push("s.status = ?");
      values.push(status);
    }

    if (route_id) {
      console.log("route_id", route_id);

      conditions.push("s.route_id = ?");
      values.push(route_id);
    }

    if (transporter_id) {
      conditions.push("s.transporter_id = ?");
      values.push(transporter_id);
    }

    // Filtro por rango de fechas
    if (startDate && endDate) {
      conditions.push("s.estimated_delivery_date BETWEEN ? AND ?");
      values.push(startDate, endDate);
    } else if (startDate) {
      conditions.push("s.estimated_delivery_date >= ?");
      values.push(startDate);
    } else if (endDate) {
      conditions.push("s.estimated_delivery_date <= ?");
      values.push(endDate);
    }
  }

  /**
   * Actualiza el estado de un envío y actualiza el campo updated_at
   */
  public async updateStatus(
    id: number,
    status: ShipmentStatus
  ): Promise<boolean> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Actualizar estado y timestamp del envío
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE shipments 
       SET status = ?, updated_at = NOW() 
       WHERE id = ?`,
        [status, id]
      );

      // Si se actualizó correctamente y el envío tiene transportador asignado
      if (result.affectedRows > 0) {
        const [shipmentRows] = await connection.execute<ShipmentRow[]>(
          "SELECT transporter_id FROM shipments WHERE id = ?",
          [id]
        );

        if (shipmentRows.length > 0 && shipmentRows[0].transporter_id) {
          await connection.execute<ResultSetHeader>(
            `UPDATE transporters 
           SET available = 1, updated_at = NOW() 
           WHERE id = ?`,
            [shipmentRows[0].transporter_id]
          );
        }
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw new DatabaseError("Error updating shipment status", error);
    } finally {
      connection.release();
    }
  }

  /**
   * Elimina un envío por su ID
   */
  public async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM shipments WHERE id = ?`;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Error deleting shipment", error);
    }
  }

  /**
   * Lista todos los envíos con paginación
   * @param page Número de página (empieza desde 1)
   * @param pageSize Cantidad de registros por página
   */
  public async findAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<ShipmentDTO[]> {
    const offset = (page - 1) * pageSize;
    const sql = `SELECT * FROM shipments LIMIT ? OFFSET ?`;

    try {
      const [rows] = await this.pool.execute<ShipmentRow[]>(sql, [
        pageSize,
        offset,
      ]);
      return rows.map((row) => mapRowToShipmentDTO(row));
    } catch (error) {
      throw new DatabaseError(
        "Error finding all shipments with pagination",
        error
      );
    }
  }
}

// Exportar una instancia del modelo
export const shipmentModel = new ShipmentModel();
