// src/models/User.ts
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import UserEntity from "../../../interfaces/auth/user.interface";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";

// Interfaces para tipar los resultados
interface UserRow extends RowDataPacket, UserEntity {}

class UserModel {
  private pool: Pool;
  constructor() {
    this.pool = getDbPool();
  }
  // Crear la tabla de usuarios si no existe
  public async createTable(): Promise<void> {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'client',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

    try {
      await this.pool.execute<ResultSetHeader>(sql);

      // Verificar si la tabla está vacía
      const isEmpty = await this.isTableEmpty();
      if (isEmpty) {
        await this.insertDefaultUsers();
      }
    } catch (error) {
      throw new DatabaseError("Error creating users table", error);
    }
  }

  // Insertar transportistas predeterminados
  private async insertDefaultUsers(): Promise<void> {
    try {
      await this.create({
        name: "admin",
        email: "admin@gmail.com",
        password:
          "$2b$10$tXTmoN8NAH4KSIHRMvQkYOsDFvlNPkfY.CArCUCgH/87jTtn/SFuW",
          role: "admin",
      });
      await this.create({
        name: "test",
        email: "test@gmail.com",
        password:
          "$2b$10$tXTmoN8NAH4KSIHRMvQkYOsDFvlNPkfY.CArCUCgH/87jTtn/SFuW",
      });
    } catch (error) {
      throw new DatabaseError(
        "Error al insertar transportistas predeterminados",
        error
      );
    }
  }

  private async isTableEmpty(): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM users`;
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

  // Crear un nuevo usuario
  public async create(
    userData: Omit<UserEntity, "id" | "created_at" | "updated_at">
  ): Promise<UserEntity> {
    const { name, email, password, role } = userData;
    let sql;
    const values = [name.trim(), email.trim().toLowerCase(), password.trim()];
    if (role) {
      sql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      values.push(role);  // Añadimos el valor del rol
    } else {
      sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `;
    }

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql,values);

      return {
        id: result.insertId,
        name,
        email,
        password: "********", // No devolver la contraseña real
        role,
      };
    } catch (error) {
      throw new DatabaseError("Error creating user", error);
    }
  }

  // Encontrar usuario por ID
  public async findById(id: number): Promise<UserEntity | null> {
    const sql = `
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `;

    try {
      const [rows] = await this.pool.execute<UserRow[]>(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError("Error finding user by ID", error);
    }
  }

  // Encontrar usuario por email (útil para autenticación)
  public async findByEmail(email: string): Promise<UserEntity | null> {
    const sql = `SELECT * FROM users WHERE email = ?`;

    try {
      const [rows] = await this.pool.execute<UserRow[]>(sql, [
        email.trim().toLowerCase(),
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError("Error finding user by email", error);
    }
  }

  // Actualizar contraseña
  public async updatePassword(id: number, password: string): Promise<boolean> {
    const sql = `UPDATE users SET password = ? WHERE id = ?`;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [
        password.trim(),
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Error updating password", error);
    }
  }

  // Eliminar usuario
  public async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM users WHERE id = ?`;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError("Error deleting user", error);
    }
  }

  // Listar todos los usuarios
  public async findAll(): Promise<UserEntity[]> {
    const sql = `
        SELECT id, name, email, role, created_at, updated_at 
        FROM users
      `;

    try {
      const [rows] = await this.pool.execute<UserRow[]>(sql);
      return rows;
    } catch (error) {
      throw new DatabaseError("Error finding all users", error);
    }
  }
}

export default new UserModel();
