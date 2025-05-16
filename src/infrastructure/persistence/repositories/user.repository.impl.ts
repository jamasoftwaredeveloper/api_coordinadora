import { UserDTO } from "../../../application/dto/user.dto";
import UserEntity from "../../../interfaces/auth/user.interface";
import { UserRepository } from "../../../interfaces/repositories/user.repository.interface";
import userModel from "../models/user.model";

export class UserRepositoryImpl implements UserRepository {
  async findById(id: number): Promise<UserDTO | null> {
    return await userModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await userModel.findByEmail(email);
  }

  async create(
    user: Omit<UserEntity, "id" | "created_at" | "updated_at">
  ): Promise<UserDTO> {
    return await userModel.create(user);
  }
}
