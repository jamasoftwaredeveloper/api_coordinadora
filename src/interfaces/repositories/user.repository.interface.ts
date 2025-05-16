import { UserDTO } from "../../application/dto/user.dto";


export interface UserRepository {
  findById(id: number): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
  create(user: UserDTO): Promise<UserDTO>;
}