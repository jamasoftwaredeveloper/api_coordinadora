import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";
import { TransporterEntity } from "../../../interfaces/transporter/transporter.interface";

// Interfaces para tipar los resultados

export class TransporterModel {
  private readonly pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || getDbPool();
  }

  // Crear un nuevo usuario
  public async create(
    userData: Omit<TransporterEntity, "id" | "created_at" | "updated_at">
  ): Promise<Omit<TransporterEntity, "created_at" | "updated_at">> {
    const { name, vehicle_capacity, available } = userData;
    let sql;
    {
      sql = `
        INSERT INTO transporters (name, vehicle_capacity)
        VALUES (?, ?)
      `;

      try {
        const [result] = await this.pool.execute<ResultSetHeader>(sql, [
          name,
          vehicle_capacity,
        ]);

        return {
          id: result.insertId,
          name,
          vehicle_capacity,
          available,
        };
      } catch (error) {
        throw new DatabaseError("Error creating user", error);
      }
    }
  }
}

export const transporterModel = new TransporterModel();
