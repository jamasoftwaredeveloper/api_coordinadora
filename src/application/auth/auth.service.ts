import { AuthUtils } from "../../domain/services/auth.utils";
import { UserRepository } from "../../interfaces/repositories/user.repository.interface";
import { JwtService } from "../../interfaces/services/jwt.service.interface";
import { Result } from "../common/result";
import { UserDTO } from "../dto/user.dto";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authUtils: AuthUtils,
    private jwtService: JwtService
  ) {}

  async register(userData: UserDTO): Promise<Result<{ token: string }>> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      return Result.fail("El email ya no está disponible", 409);
    }

    // Hashear la contraseña
    userData.password = await this.authUtils.hashPassword(userData.password);

    // Crear el usuario
    const newUser = await this.userRepository.create(userData);

    // Generar JWT
    const token = this.jwtService.generate({
      id: newUser.id,
      email: newUser.email,
    });

    return Result.ok({ token });
  }

  async login(
    email: string,
    password: string
  ): Promise<Result<{ token: string }>> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return Result.fail("El email no coincide con ningún usuario", 404);
    }

    // Verificar contraseña
    const isPasswordValid = await this.authUtils.checkPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return Result.fail("Revisar el correo o la contraseña, no válidas", 401);
    }

    // Generar JWT
    const token = this.jwtService.generate({
      id: user.id,
      email: user.email,
    });

    return Result.ok({ token });
  }

  async getUserById(userId: number): Promise<Result<{ user: UserDTO }>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return Result.fail("El usuario no existe", 404);
    }

    // Eliminar datos sensibles antes de devolver
    const { password, ...userData } = user;

    return Result.ok({ user: userData as UserDTO });
  }
}
