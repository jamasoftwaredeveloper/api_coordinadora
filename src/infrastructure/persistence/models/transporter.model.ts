import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";

// Interfaces para tipar los resultados

export class TransporterModel {
  private pool: Pool;

  constructor() {
    this.pool = getDbPool();
  }

  // Crear la tabla de transportistas si no existe
  public async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS transporters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        available BOOLEAN DEFAULT 1,
        vehicle_capacity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    try {
      // Crear la tabla si no existe
      await this.pool.execute<ResultSetHeader>(sql);

      // Verificar si la tabla está vacía
      const isEmpty = await this.isTableEmpty();
      if (isEmpty) {
        await this.insertDefaultTransporters();
      }
    } catch (error) {
      throw new DatabaseError("Error al crear o verificar la tabla de transportistas", error);
    }
  }

  // Verificar si la tabla está vacía
  private async isTableEmpty(): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM transporters`;
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(sql);
      return rows[0].count === 0;
    } catch (error) {
      throw new DatabaseError("Error al verificar si la tabla está vacía", error);
    }
  }

  // Insertar transportistas predeterminados
  private async insertDefaultTransporters(): Promise<void> {
    const sql = `
      INSERT INTO transporters (name, available, vehicle_capacity) VALUES 
      (?, ?, ?), 
      (?, ?, ?), 
      (?, ?, ?);
    `;
    const defaultTransporters = [
      "Transportista A", true, 1000,
      "Transportista B", true, 800,
      "Transportista C", true, 1200,
    ];

    try {
      await this.pool.execute<ResultSetHeader>(sql, defaultTransporters);
    } catch (error) {
      throw new DatabaseError("Error al insertar transportistas predeterminados", error);
    }
  }
}

export const transporterModel = new TransporterModel();
