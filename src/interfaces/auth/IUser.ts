export default interface IUser {
  id: number;
  handle: string;
  name: string;
  email: string;
  password: string;
  description?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para la creación de un usuario
export type UserCreateDTO = Omit<IUser, "id" | "created_at" | "updated_at">;

// Tipo para la actualización de un usuario
export type UserUpdateDTO = Partial<
  Omit<
    IUser,
    "id" | "email" | "handle" | "password" | "created_at" | "updated_at"
  >
>;

// Tipo para la respuesta de usuario (sin contraseña)
export type UserResponse = Omit<IUser, "password">;
