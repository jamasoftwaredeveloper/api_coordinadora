// src/config/database.ts
import { Pool, createPool } from "mysql2/promise";

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

class Database {
  private static pool: Pool;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "1993",
      database: process.env.MYSQL_DB || "db_coordinadora",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  public getPool(): Pool {
    if (!Database.pool) {
      try {
        Database.pool = createPool(this.config);
        console.log("MySQL connection pool created successfully");
      } catch (error) {
        console.error("Error creating MySQL connection pool:", error);
        throw error;
      }
    }
    return Database.pool;
  }
}

export default new Database();
