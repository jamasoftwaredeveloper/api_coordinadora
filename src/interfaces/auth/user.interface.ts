export default interface UserEntity {
  id: number;
  name: string;
  email: string;
  role?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para la respuesta de usuario (sin contraseña)
export type UserResponse = Omit<UserEntity, "password">;
