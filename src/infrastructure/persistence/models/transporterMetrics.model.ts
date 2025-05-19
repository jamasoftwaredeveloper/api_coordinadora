import { Pool, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";

/**
 * Interfaz para métricas de transportistas
 */
interface TransporterMetrics {
  transporter_id: number;
  transporter_name: string;
  total_shipments: number;
  completed_shipments: number;
  avg_delivery_time_days: number | null;
  completion_rate: number;
  pending_shipments: number;
  in_transit_shipments: number;
  delivered_shipments: number;
  cancelled_shipments: number;
}

/**
 * Interfaz para métricas de rendimiento por ruta
 */
interface RoutePerformanceMetrics {
  route_id: number;
  route_name: string;
  transporter_id: number;
  transporter_name: string;
  total_shipments: number;
  avg_delivery_time_days: number | null;
}

/**
 * Interfaz para métricas mensuales de rendimiento
 */
interface MonthlyPerformanceMetrics {
  transporter_id: number;
  transporter_name: string;
  year: number;
  month: number;
  total_shipments: number;
  completed_shipments: number;
  avg_delivery_time_days: number | null;
}

/**
 * Modelo para obtener métricas de rendimiento de transportistas
 */
export class TransporterMetricsModel {
  private readonly pool: Pool;

  /**
   * Constructor que permite inyección de dependencias para facilitar testing
   * @param pool Conexión a la base de datos (opcional, usa la conexión por defecto si no se proporciona)
   */
  constructor(pool?: Pool) {
    this.pool = pool || getDbPool();
  }


  /**
   * Obtiene métricas de rendimiento de transportistas para un período específico
   * @param startDate Fecha de inicio del período
   * @param endDate Fecha de fin del período
   * @returns Métricas de rendimiento por transportista
   */
  public async getTransporterPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<TransporterMetrics[]> {
    const sql = `
      SELECT 
        t.id AS transporter_id,
        t.name AS transporter_name,
        COUNT(s.id) AS total_shipments,
        SUM(CASE WHEN s.status = 'Entregado' THEN 1 ELSE 0 END) AS completed_shipments,
        AVG(
          CASE 
            WHEN s.status = 'Entregado' THEN 
              TIMESTAMPDIFF(DAY, s.created_at, s.updated_at)
            ELSE NULL
          END
        ) AS avg_delivery_time_days,
        (SUM(CASE WHEN s.status = 'Entregado' THEN 1 ELSE 0 END) / COUNT(s.id)) * 100 AS completion_rate,
        SUM(CASE WHEN s.status = 'En espera' THEN 1 ELSE 0 END) AS pending_shipments,
        SUM(CASE WHEN s.status = 'En procesamiento' THEN 1 ELSE 0 END) AS in_transit_shipments,
        SUM(CASE WHEN s.status = 'Entregado' THEN 1 ELSE 0 END) AS delivered_shipments,
        SUM(CASE WHEN s.status = 'Cancelado' THEN 1 ELSE 0 END) AS cancelled_shipments
      FROM 
        shipments s
        INNER JOIN transporters t ON s.transporter_id = t.id
      WHERE 
        s.created_at BETWEEN ? AND ?
      GROUP BY 
        s.transporter_id, t.name
      ORDER BY 
        avg_delivery_time_days ASC
    `;

    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [
        startDate,
        endDate,
      ]);

      return rows as TransporterMetrics[];
    } catch (error) {
      throw new DatabaseError(
        "Error getting transporter performance metrics",
        error
      );
    }
  }

  /**
   * Obtiene métricas de rendimiento por ruta y transportista
   * @param startDate Fecha de inicio del período
   * @param endDate Fecha de fin del período
   * @returns Métricas de rendimiento por ruta y transportista
   */
  public async getRoutePerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<RoutePerformanceMetrics[]> {
    const sql = `
      SELECT 
        r.id AS route_id,
        r.name AS route_name,
        t.id AS transporter_id, 
        t.name AS transporter_name,
        COUNT(s.id) AS total_shipments,
        AVG(TIMESTAMPDIFF(DAY, s.created_at, 
          CASE 
            WHEN s.status = 'Entregado' THEN s.updated_at 
            ELSE NULL 
          END)) AS avg_delivery_time_days
      FROM 
        shipments s
        INNER JOIN transporters t ON s.transporter_id = t.id
        INNER JOIN routes r ON s.route_id = r.id
      WHERE 
        s.created_at BETWEEN ? AND ?
        AND s.status = 'Entregado'
      GROUP BY 
        r.id, r.name, t.id, t.name
      ORDER BY 
        r.name, avg_delivery_time_days
    `;

    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [
        startDate,
        endDate,
      ]);

      return rows as RoutePerformanceMetrics[];
    } catch (error) {
      throw new DatabaseError("Error getting route performance metrics", error);
    }
  }

  /**
   * Obtiene métricas mensuales de rendimiento de transportistas
   * @param startDate Fecha de inicio del período
   * @param endDate Fecha de fin del período
   * @returns Métricas mensuales de rendimiento por transportista
   */
  public async getMonthlyPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<MonthlyPerformanceMetrics[]> {
    const sql = `
      SELECT 
        t.id AS transporter_id,
        t.name AS transporter_name,
        YEAR(s.created_at) AS year,
        MONTH(s.created_at) AS month,
        COUNT(s.id) AS total_shipments,
        SUM(CASE WHEN s.status = 'Entregado' THEN 1 ELSE 0 END) AS completed_shipments,
        AVG(
          CASE 
            WHEN s.status = 'Entregado' THEN 
              TIMESTAMPDIFF(DAY, s.created_at, s.updated_at)
            ELSE NULL
          END
        ) AS avg_delivery_time_days
      FROM 
        shipments s
        INNER JOIN transporters t ON s.transporter_id = t.id
      WHERE 
        s.created_at BETWEEN ? AND ?
      GROUP BY 
        t.id, t.name, YEAR(s.created_at), MONTH(s.created_at)
      ORDER BY 
        t.name, year, month
    `;

    try {
      const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [
        startDate,
        endDate,
      ]);

      return rows as MonthlyPerformanceMetrics[];
    } catch (error) {
      throw new DatabaseError(
        "Error getting monthly performance metrics",
        error
      );
    }
  }
}

// Exportar una instancia del modelo
export const transporterMetricsModel = new TransporterMetricsModel();
