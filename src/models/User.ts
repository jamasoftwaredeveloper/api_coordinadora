// src/models/User.ts
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import config from "../config/db";
import IUser from "../interfaces/auth/IUser";
import { DatabaseError } from "../interfaces/errors/DatabaseError";

// Interfaces para tipar los resultados
interface UserRow extends RowDataPacket, IUser {}

class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = config.getPool();
  }

  // Crear la tabla de usuarios si no existe
  public async createTable(): Promise<ResultSetHeader> {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        handle VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        description TEXT NULL,
        image VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql);
      return result;
    } catch (error) {
      throw new DatabaseError("Error creating users table", error);
    }
  }

  // Crear un nuevo usuario
  public async create(
    userData: Omit<IUser, "id" | "created_at" | "updated_at">
  ): Promise<IUser> {
    const {
      handle,
      name,
      email,
      password,
      description = "",
      image = "",
    } = userData;

    const sql = `
      INSERT INTO users (handle, name, email, password, description, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(sql, [
        handle.trim().toLowerCase(),
        name.trim(),
        email.trim().toLowerCase(),
        password.trim(),
        description || "",
        image || "",
      ]);

      return {
        id: result.insertId,
        handle,
        name,
        email,
        password: "********", // No devolver la contraseña real
        description: description || "",
        image: image || "",
      };
    } catch (error) {
      throw new DatabaseError("Error creating user", error);
    }
  }

  // Encontrar usuario por ID
  public async findById(id: number): Promise<IUser | null> {
    const sql = `
      SELECT id, handle, name, email, description, image, created_at, updated_at 
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
  public async findByEmail(email: string): Promise<IUser | null> {
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

  // Encontrar usuario por handle y email
  public async findByHandleEmail(
    handle: string,
    email: string
  ): Promise<IUser | null> {
    const sql = `
      SELECT id, handle, name, email, description, image, created_at, updated_at 
      FROM users 
      WHERE handle = ? AND email = ?
    `;

    try {
      const [rows] = await this.pool.execute<UserRow[]>(sql, [
        handle.trim().toLowerCase(),
        email.trim().toLowerCase(),
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError("Error finding user by handle", error);
    }
  }
  // Encontrar usuario por handle
  public async findByHandle(handle: string): Promise<IUser | null> {
    const sql = `
      SELECT id, handle, name, email, description, image, created_at, updated_at 
      FROM users 
      WHERE handle = ?
    `;

    try {
      const [rows] = await this.pool.execute<UserRow[]>(sql, [
        handle.trim().toLowerCase(),
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new DatabaseError("Error finding user by handle", error);
    }
  }
  // Actualizar usuario por ID
  public async update(
    email: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const { name, description, image } = userData;

    // Validar que tenemos al menos un campo para actualizar
    if (!name && description === undefined && image === undefined) {
      throw new Error("At least one field must be provided for update");
    }

    const sql = `
      UPDATE users
      SET name = ?, description = ?, image = ?
      WHERE email = ?
    `;

    try {
      await this.pool.execute<ResultSetHeader>(sql, [
        name?.trim() || null,
        description !== undefined ? description : null,
        image !== undefined ? image : null,
        email,
      ]);

      return this.findByEmail(email);
    } catch (error) {
      throw new DatabaseError("Error updating user", error);
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
  public async findAll(): Promise<IUser[]> {
    const sql = `
      SELECT id, handle, name, email, description, image, created_at, updated_at 
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
