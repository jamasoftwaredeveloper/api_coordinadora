import { Request } from "express";
import UserEntity from "./user.interface";


export interface AuthRequest extends Request {
  user_id: string; // Agregamos `user` con el tipo `IToken`
}

export interface ProfileRequest extends Request {
  user: Omit<UserEntity, "name" | "password">; // Agregamos `user` con el tipo `IToken`
}