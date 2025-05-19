// src/infrastructure/persistence/models/route.model.ts

import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { AssingShipmentDTO } from "../../../application/dto/shipment.dto";
import { TransporterDTO } from "../../../application/dto/transporter.dto";
import { RouteRow, TransporterRow } from "../../../interfaces/route/route.interface";
import { IRouteRepository } from "../../../domain/repositories/IRouteRepository";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";

/**
 * Implementación del repositorio de rutas usando MySQL
 */
export class RouteModel implements IRouteRepository {
  private readonly pool: Pool;

  /**
   * Constructor que permite inyección de dependencias para facilitar testing
   * @param pool Conexión a la base de datos (opcional, usa la conexión por defecto si no se proporciona)
   */
  constructor(pool?: Pool) {
    this.pool = pool || getDbPool();
  }

  /**
   * Encuentra rutas disponibles
   * @returns Lista de rutas disponibles
   */
  public async findAvailableRoutes(): Promise<RouteRow[]> {
    const sql = `SELECT * FROM routes WHERE available = 1`;
    
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql);
      return rows as RouteRow[];
    } catch (error) {
      throw new DatabaseError("Error finding available routes", error);
    }
  }

  /**
   * Encuentra un transportista por su ID
   * @param transporterId ID del transportista
   * @returns Datos del transportista o null si no existe
   */
  public async findTransporterById(
    transporterId: number
  ): Promise<TransporterDTO | null> {
    const sql = `SELECT * FROM transporters WHERE id = ? AND available = 1`;
    
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [transporterId]);
      return rows.length > 0 ? rows[0] as TransporterDTO : null;
    } catch (error) {
      throw new DatabaseError("Error finding transporter by ID", error);
    }
  }

  /**
   * Asigna una ruta a un envío
   * @param assignmentData Datos de asignación (id del envío, id de la ruta, id del transportista)
   * @returns Resultado de la operación
   */
  public async assignRouteToShipment({
    id,
    routeId,
    transporterId,
  }: AssingShipmentDTO): Promise<boolean> {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Actualizar el envío con la ruta y transportista asignados
      const [shipmentResult] = await connection.execute<ResultSetHeader>(
        `UPDATE shipments SET route_id = ?, transporter_id = ? WHERE id = ?`,
        [routeId, transporterId, id]
      );

      // Marcar el transportista como no disponible
      const [transporterResult] = await connection.execute<ResultSetHeader>(
        `UPDATE transporters SET available = ? WHERE id = ?`,
        [0, transporterId]
      );

      // Verificar si ambas operaciones fueron exitosas
      const success = shipmentResult.affectedRows > 0 && transporterResult.affectedRows > 0;
      
      if (success) {
        await connection.commit();
      } else {
        await connection.rollback();
      }
      
      return success;
    } catch (error) {
      await connection.rollback();
      throw new DatabaseError("Error assigning route to shipment", error);
    } finally {
      connection.release();
    }
  }

  /**
   * Obtiene todas las rutas formateadas para selectores (label/value)
   * @returns Lista completa de rutas
   */
  public async allRoutes(): Promise<RouteRow[]> {
    const sql = `SELECT name as label, id as value FROM routes`;
    
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql);
      return rows as RouteRow[];
    } catch (error) {
      throw new DatabaseError("Error fetching all routes", error);
    }
  }

  /**
   * Obtiene todos los transportistas formateados para selectores (label/value)
   * @returns Lista completa de transportistas
   */
  public async allTransporters(): Promise<TransporterRow[]> {
    const sql = `SELECT name as label, id as value FROM transporters`;
    
    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql);
      return rows as TransporterRow[];
    } catch (error) {
      throw new DatabaseError("Error fetching all transporters", error);
    }
  }
}

// Exportar una instancia del modelo
export const routeModel = new RouteModel();