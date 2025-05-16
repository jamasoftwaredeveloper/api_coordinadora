export default interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para la creación de un usuario
export type UserCreateDTO = Omit<IUser, "id" | "created_at" | "updated_at">;

// Tipo para la respuesta de usuario (sin contraseña)
export type UserResponse = Omit<IUser, "password">;
