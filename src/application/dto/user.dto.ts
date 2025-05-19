// Tipo para la creación de un usuario
export interface UserDTO {
    id?: number;
    email: string;
    password: string;
    [key: string]: any; // Para propiedades adicionales
  }