import { Pool } from "mysql2/promise"; // o el paquete que uses para conectar a MySQL

export async function up(pool: Pool): Promise<void> {
  const createTableSQL = `
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
    await pool.execute(createTableSQL);
    console.log("Migration 001: routes table created or already exists.");
  } catch (error) {
    console.error("Error creating routes table:", error);
    throw error;
  }
}
