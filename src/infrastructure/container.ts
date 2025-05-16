import { UserRepositoryImpl } from "./persistence/repositories/user.repository.impl";
import { JwtServiceImpl } from "./services/jwt.service.impl";
import { AuthService } from "../application/auth/auth.service";
import { AuthUtils } from "../domain/services/auth.utils";


class Container {
  private services: Map<string, any> = new Map();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    // Repositorios
    const userRepository = new UserRepositoryImpl();
    
    // Servicios de utilidad
    const jwtService = new JwtServiceImpl();
    const authUtils = new AuthUtils();

    // Servicios de aplicación
    const authService = new AuthService(userRepository, authUtils, jwtService);

    // Registrar servicios
    this.services.set("UserRepository", userRepository);
    this.services.set("JwtService", jwtService);
    this.services.set("AuthUtils", authUtils);
    this.services.set("AuthService", authService);
  }

  resolve(name: string): any {
    return this.services.get(name);
  }
}

export const container = new Container();