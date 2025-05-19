import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { DatabaseError } from "../../interfaces/errors/DatabaseError";

// Verificar si la tabla está vacía
async function isTableEmpty(pool: Pool): Promise<boolean> {
  const sql = `SELECT COUNT(*) AS count FROM users`;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows[0].count === 0;
  } catch (error) {
    throw new DatabaseError("Error al verificar si la tabla está vacía", error);
  }
}

// Insertar trtansportador predeterminadas
async function insertDefaultUsers(pool: Pool): Promise<void> {
  const sql = `
    INSERT INTO users (name, email, password, role) VALUES 
    (?, ?, ?, ?), 
    (?, ?, ?, ?), 
    (?, ?, ?, ?);
`;
  const defaultUsers = [
    "admin",
    "admin@gmail.com",
    "$2b$10$tXTmoN8NAH4KSIHRMvQkYOsDFvlNPkfY.CArCUCgH/87jTtn/SFuW",
    "admin",
    "test",
    "test@gmail.com",
    "$2b$10$tXTmoN8NAH4KSIHRMvQkYOsDFvlNPkfY.CArCUCgH/87jTtn/SFuW",
  ];

  try {
    await pool.execute<ResultSetHeader>(sql, defaultUsers);
    console.log("Rutas predeterminadas insertadas correctamente");
  } catch (error) {
    throw new DatabaseError(
      "Error al insertar usuarios predeterminadas",
      error
    );
  }
}

// Ejecutar el seeder
export async function runUserSeeder(pool: Pool): Promise<void> {
  if (await isTableEmpty(pool)) {
    await insertDefaultUsers(pool);
  } else {
    console.log(
      "La tabla de usuarios ya contiene datos, se omiten los seeders"
    );
  }
}
