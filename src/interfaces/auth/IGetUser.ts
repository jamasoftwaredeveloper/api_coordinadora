import { Request } from "express";
import IUser from "./IUser";

export interface AuthRequest extends Request {
  user_id: string; // Agregamos `user` con el tipo `IToken`
}

export interface ProfileRequest extends Request {
  user: Omit<IUser, "name" | "password">; // Agregamos `user` con el tipo `IToken`
}