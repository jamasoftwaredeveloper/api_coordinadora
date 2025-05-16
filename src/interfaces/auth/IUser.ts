export default interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para la creación de un usuario
export interface UserDTO {
  id?: number;
  email: string;
  password: string;
  [key: string]: any; // Para propiedades adicionales
}

// Tipo para la respuesta de usuario (sin contraseña)
export type UserResponse = Omit<IUser, "password">;
