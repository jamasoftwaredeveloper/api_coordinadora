import { Pool } from "mysql2/promise"; // o el paquete que uses para conectar a MySQL

export async function up(pool: Pool): Promise<void> {
  const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'client',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
  `;

  try {
    await pool.execute(createTableSQL);
    console.log("Migration 001: users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}
