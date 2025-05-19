import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { DatabaseError } from "../../interfaces/errors/DatabaseError";

// Verificar si la tabla está vacía
async function isTableEmpty(pool: Pool): Promise<boolean> {
  const sql = `SELECT COUNT(*) AS count FROM routes`;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows[0].count === 0;
  } catch (error) {
    throw new DatabaseError("Error al verificar si la tabla está vacía", error);
  }
}

// Insertar rutas predeterminadas
async function insertDefaultRoutes(pool: Pool): Promise<void> {
  const sql = `
    INSERT INTO users (name, capacity, available) VALUES 
    (?, ?, ?), 
    (?, ?, ?), 
    (?, ?, ?);
  `;
  const defaultRoutes = [
    "Ruta A", 50, 1,
    "Ruta B", 30, 1,
    "Ruta C", 70, 1,
  ];

  try {
    await pool.execute<ResultSetHeader>(sql, defaultRoutes);
    console.log("Rutas predeterminadas insertadas correctamente");
  } catch (error) {
    throw new DatabaseError("Error al insertar rutas predeterminadas", error);
  }
}

// Ejecutar el seeder
export async function runRouteSeeder(pool: Pool): Promise<void> {
  if (await isTableEmpty(pool)) {
    await insertDefaultRoutes(pool);
  } else {
    console.log("La tabla de rutas ya contiene datos, se omiten los seeders");
  }
}
