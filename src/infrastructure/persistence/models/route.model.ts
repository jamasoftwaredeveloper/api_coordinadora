import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";
import { RouteDTO } from "../../../application/dto/route.dto";
import { AssingShipmentDTO } from "../../../application/dto/shipment.dto";
import { TransporterDTO } from "../../../application/dto/transporter.dto";

// Interfaces para tipar los resultados
interface RouteRow
  extends RowDataPacket,
    Omit<RouteDTO, "createdAt" | "updatedAt"> {
  created_at: Date;
  updated_at: Date;
}

interface TransporterRow
  extends RowDataPacket,
    Omit<TransporterDTO, "createdAt" | "updatedAt"> {
  created_at: Date;
  updated_at: Date;
}

export class RouteModel {
  private pool: Pool;

  constructor() {
    this.pool = getDbPool();
  }

  // Crear la tabla de rutas si no existe
  public async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        available BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    try {
      // Crear la tabla si no existe
      await this.pool.execute<ResultSetHeader>(sql);
      console.log("Tabla 'routes' verificada o creada correctamente.");

      // Verificar si la tabla está vacía
      const isEmpty = await this.isTableEmpty();
      if (isEmpty) {
        await this.insertDefaultRoutes();
        console.log("Rutas predeterminadas insertadas.");
      } else {
        console.log("La tabla ya contiene rutas.");
      }
    } catch (error) {
      throw new DatabaseError(
        "Error al crear o verificar la tabla de rutas",
        error
      );
    }
  }

  // Verificar si la tabla está vacía
  private async isTableEmpty(): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM routes`;
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(sql);
      return rows[0].count === 0;
    } catch (error) {
      throw new DatabaseError(
        "Error al verificar si la tabla está vacía",
        error
      );
    }
  }

  // Insertar rutas predeterminadas
  private async insertDefaultRoutes(): Promise<void> {
    const sql = `
      INSERT INTO routes (name, capacity, available) VALUES 
      (?, ?, ?), 
      (?, ?, ?), 
      (?, ?, ?);
    `;
    const defaultRoutes = [
      "Ruta A",
      50,
      true,
      "Ruta B",
      30,
      true,
      "Ruta C",
      70,
      true,
    ];

    try {
      await this.pool.execute<ResultSetHeader>(sql, defaultRoutes);
    } catch (error) {
      throw new DatabaseError("Error al insertar rutas predeterminadas", error);
    }
  }

  // Encontrar rutas disponibles
  public async findAvailableRoutes(): Promise<RouteRow[]> {
    const sql = `SELECT * FROM routes WHERE available = 1`;
    const [rows] = await this.pool.execute<RouteRow[]>(sql);
    return rows;
  }

  // Encontrar transportista por ID
  public async findTransporterById(
    transporterId: number
  ): Promise<TransporterDTO | null> {
    const sql = `SELECT * FROM transporters WHERE id = ? AND available = 1`;
    const [rows] = await this.pool.execute<TransporterRow[]>(sql, [
      transporterId,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Asignar una ruta a un envío
  public async assignRouteToShipment({
    id,
    routeId,
    transporterId,
  }: AssingShipmentDTO): Promise<boolean> {
    
    const sql = `UPDATE shipments SET route_id = ?, transporter_id = ? WHERE id = ?`;
    const [result] = await this.pool.execute<ResultSetHeader>(sql, [
      routeId,
      transporterId,
      id,
    ]);

    const sqlTransporters = `UPDATE transporters SET available = ? WHERE id = ?`;
    const [resultTransporter] = await this.pool.execute<ResultSetHeader>(
      sqlTransporters,
      [0, transporterId]
    );
    return result.affectedRows > 0 && resultTransporter.affectedRows > 0;
  }

  // Todas las rutas disponibles
  public async allRoutes(): Promise<RouteRow[]> {
    const sql = `SELECT * FROM routes`;
    const [rows] = await this.pool.execute<RouteRow[]>(sql);
    return rows;
  }

  public async allTransporters(): Promise<TransporterRow[]> {
    const sql = `SELECT * FROM transporters`;
    const [rows] = await this.pool.execute<TransporterRow[]>(sql);
    return rows;
  }
}

// Exportar una instancia del modelo
export const routeModel = new RouteModel();
