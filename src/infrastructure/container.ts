import { UserRepositoryImpl } from "./persistence/repositories/user.repository.impl";
import { JwtServiceImpl } from "./services/jwt.service.impl";
import { AuthService } from "../application/auth/auth.service";
import { AuthUtils } from "../domain/services/auth.utils";
import { ShipmentRepositoryImpl } from "./persistence/repositories/shipment.repository.impl";
import { NotificationServiceImpl } from "./services/notification.service.impl";
import { AddressValidationServiceImpl } from "./services/address-validation.service.impl";
import { ShipmentService } from "../application/shipping/shipment.service";
import { RouteRepositoryImpl } from "./persistence/repositories/route.repository.impl";
import { ValidateWeightCapacityServiceImpl } from "./services/validate-volume-capacity.service.impl";
import { Server as SocketIOServer } from "socket.io";

class Container {
  private services: Map<string, any> = new Map();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    // Repositorios
    const userRepository = new UserRepositoryImpl();
    const shipmentRepository = new ShipmentRepositoryImpl();
    const routeRepository = new RouteRepositoryImpl();

    // Servicios de utilidad
    const jwtService = new JwtServiceImpl();
    const authUtils = new AuthUtils();

    const notificationService = new NotificationServiceImpl();
    const validateWeightCapacityService = new ValidateWeightCapacityServiceImpl();
    const addressValidationService = new AddressValidationServiceImpl();
    // Repositorios de rutas

    // Servicios de aplicación
    const authService = new AuthService(userRepository, authUtils, jwtService);
    const shipmentService = new ShipmentService(
      shipmentRepository,
      userRepository,
      notificationService,
      addressValidationService,
      routeRepository,
      validateWeightCapacityService,
      new SocketIOServer
    );

    // Registrar servicios
    this.services.set("UserRepository", userRepository);
    this.services.set("RouteRepository", routeRepository);
    this.services.set("JwtService", jwtService);
    this.services.set("AuthUtils", authUtils);
    this.services.set("AuthService", authService);
    this.services.set("NotificationService", notificationService);
    this.services.set("ValidateWeightCapacityService", validateWeightCapacityService);
    this.services.set("AddressValidationService", addressValidationService);
    this.services.set("AuthService", authService);
    this.services.set("ShipmentService", shipmentService);
  }

  resolve(name: string): any {
    return this.services.get(name);
  }
}

export const container = new Container();