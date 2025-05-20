// src/models/User.ts
import UserEntity from "../../interfaces/auth/user.interface";

export class User implements UserEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: UserEntity) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
