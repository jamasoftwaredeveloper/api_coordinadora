import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { DatabaseError } from "../../interfaces/errors/DatabaseError";

// Verificar si la tabla está vacía
async function isTableEmpty(pool: Pool): Promise<boolean> {
  const sql = `SELECT COUNT(*) AS count FROM transporters`;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows[0].count === 0;
  } catch (error) {
    throw new DatabaseError("Error al verificar si la tabla está vacía", error);
  }
}

// Insertar trtansportador predeterminadas
async function insertDefaultTransporters(pool: Pool): Promise<void> {
  const sql = `
  INSERT INTO transporters (name, available, vehicle_capacity) VALUES 
  (?, ?, ?), 
  (?, ?, ?), 
  (?, ?, ?);
`;
  const defaultTransporters = [
    "Transportista A",
    true,
    1000,
    "Transportista B",
    true,
    800,
    "Transportista C",
    true,
    1200,
  ];

  try {
    await pool.execute<ResultSetHeader>(sql, defaultTransporters);
    console.log("Rutas predeterminadas insertadas correctamente");
  } catch (error) {
    throw new DatabaseError("Error al insertar transportador predeterminadas", error);
  }
}

// Ejecutar el seeder
export async function runTransporterSeeder(pool: Pool): Promise<void> {
  if (await isTableEmpty(pool)) {
    await insertDefaultTransporters(pool);
  } else {
    console.log("La tabla de transportador ya contiene datos, se omiten los seeders");
  }
}
