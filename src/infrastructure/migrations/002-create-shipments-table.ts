import { Pool } from "mysql2/promise"; // o el paquete que uses para conectar a MySQL

export async function up(pool: Pool): Promise<void> {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS shipments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT DEFAULT NULL,
        transporter_id INT DEFAULT NULL,
        user_id INT NOT NULL,
        package_info JSON NOT NULL,
        exit_address JSON NOT NULL,
        destination_address JSON NOT NULL,
        status VARCHAR(50) NOT NULL,
        tracking_number VARCHAR(100),
        estimated_delivery_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (route_id) REFERENCES routes(id),
        FOREIGN KEY (transporter_id) REFERENCES transporters(id),
        INDEX idx_status (status),
        INDEX idx_transporter_id (transporter_id),
        INDEX idx_route_id (route_id),
        INDEX idx_destination_address ((CAST(destination_address->>'$.address' AS CHAR(100))))
    );
  `;

  try {
    await pool.execute(createTableSQL);
    console.log("Migration 001: shipments table created or already exists.");
  } catch (error) {
    console.error("Error creating shipments table:", error);
    throw error;
  }
}
