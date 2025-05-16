import User from "../../../domain/auth/user.entity";
import IUser, { UserDTO } from "../../../interfaces/auth/IUser";
import { UserRepository } from "../../../interfaces/repositories/user.repository.interface";

export class UserRepositoryImpl implements UserRepository {
  async findById(id: number): Promise<UserDTO | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await User.findByEmail(email);
  }

  async create(user: Omit<IUser, "id" | "created_at" | "updated_at">): Promise<UserDTO> {
    return await User.create(user);
  }
}