import { ShipmentRepository } from "../../interfaces/repositories/shipment.repository.interface";
import { NotificationService } from "../../interfaces/services/notification.service.interface";
import { UserRepository } from "../../interfaces/repositories/user.repository.interface";
import { Result } from "../common/result";
import {
  AssingShipmentDTO,
  CreateShipmentDTO,
  ShipmentDTO,
  ShipmentResponseDTO,
} from "../dto/shipment.dto";
import {
  Filter,
  ShipmentStatus,
} from "../../interfaces/order/shipment.interface";
import { Shipment } from "../../domain/order/shipment.entity";
import { AddressValidationService } from "../../infrastructure/services/address-validation.service.interface";
import { RouteRepository } from "../../interfaces/repositories/route.repository.interface";
import { RouteDTO } from "../dto/route.dto";
import { TransporterDTO } from "../dto/transporter.dto";
import { ValidateWeightCapacityService } from "../../interfaces/services/validateWeightCapacity.service.interface";
import { emitUpdate } from "../../infrastructure/websocket/socket";
import { Server as SocketIOServer } from "socket.io";
import { TransporterEntity } from "../../interfaces/transporter/transporter.interface";

export class ShipmentService {
  constructor(
    private shipmentRepository: ShipmentRepository,
    private userRepository: UserRepository,
    private notificationService: NotificationService,
    private addressValidationService: AddressValidationService,
    private routeRepository: RouteRepository,
    private validateWeightCapacityService: ValidateWeightCapacityService,
    private io: SocketIOServer
  ) {}

  async createShipment(
    data: CreateShipmentDTO
  ): Promise<Result<ShipmentResponseDTO>> {
    try {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(data.userId);
      if (!user) {
        return Result.fail("Usuario no encontrado", 404);
      }

      // Validar la dirección
      const isAddressValid =
        await this.addressValidationService.validateAddress(
          data.destinationAddress
        );
      if (!isAddressValid) {
        return Result.fail("La dirección de destino no es válida", 400);
      }

      // Crear la entidad de dominio para aplicar reglas de negocio
      const shipmentEntity = new Shipment({
        ...data,
        status: ShipmentStatus.PENDING,
      });

      // Validar la dirección usando la lógica de dominio
      if (!shipmentEntity.isValidAddress()) {
        return Result.fail(
          "La dirección de destino está incompleta o es inválida",
          400
        );
      }

      // Generar número de seguimiento
      const trackingNumber = shipmentEntity.generateTrackingNumber();

      // Calcular el costo del envío
      const shippingCost = shipmentEntity.calculateShippingCost();

      // Estimación de fecha de entrega (ejemplo: 3 días desde hoy)
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

      // Preparar los datos para la persistencia
      const shipmentData = {
        ...data,
        status: ShipmentStatus.PENDING,
        trackingNumber,
        estimatedDeliveryDate,
      };

      // Persistir en la base de datos
      const createdShipment = await this.shipmentRepository.create(
        shipmentData
      );

      // Enviar notificación al usuario
      await this.notificationService.sendEmail({
        to: user.email,
        subject: "Orden de envío creada con éxito",
        content: `Tu orden de envío ha sido creada con éxito. Número de seguimiento: ${trackingNumber}`,
      });
      emitUpdate(this.io, { message: "Nuevo dato" });
      // Devolver respuesta
      return Result.ok({
        id: createdShipment.id!,
        trackingNumber: trackingNumber!,
        status: ShipmentStatus.PENDING,
        estimatedDeliveryDate,
        cost: shippingCost,
        message: "Orden de envío creada con éxito",
      });
    } catch (error) {
      console.error("Error al crear el envío:", error);
      return Result.fail("Error al procesar la solicitud de envío", 500);
    }
  }

  // Otros métodos del servicio...
  async getShipmentsByUserId(
    userId: number,
    parameters?: Filter
  ): Promise<Result<ShipmentResponseDTO[]>> {
    try {
      const shipments = await this.shipmentRepository.findByUserId(
        userId,
        parameters
      );

      const shipmentResponses = shipments.map((shipment) => {
        const entity = new Shipment(shipment);
        return {
          id: shipment.id!,
          trackingNumber: shipment.trackingNumber!,
          route: shipment.route,
          transporter: shipment.transporter,
          status: shipment.status,
          estimatedDeliveryDate: shipment.estimatedDeliveryDate,
          cost: entity.calculateShippingCost(),
          destinationAddress: shipment.destinationAddress,
          exitAddress: shipment.exitAddress,
          packageInfo: shipment.packageInfo,
          message: "",
        };
      });

      return Result.ok(shipmentResponses);
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
      return Result.fail("Error al obtener los envíos del usuario", 500);
    }
  }

  async findByTrackingNumber(
    trackingNumber: string
  ): Promise<Result<ShipmentDTO>> {
    try {
      const shipment = await this.shipmentRepository.findByTrackingNumber(
        trackingNumber
      );
      if (!shipment) {
        return Result.fail(
          "No se encontraron envíos con ese número de seguimiento",
          404
        );
      }
      return Result.ok(shipment);
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
      return Result.fail("Error al obtener los envíos del usuario", 500);
    }
  }
  async updateStatus(
    id: number,
    status: ShipmentStatus
  ): Promise<Result<boolean>> {
    try {
      const shipment = await this.shipmentRepository.updateStatus(id, status);
      if (!shipment) {
        return Result.fail("No se pudo actualizar el estado del envío", 404);
      }
      emitUpdate(this.io, { message: "Actualizado dato" });
      return Result.ok(shipment);
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
      return Result.fail("Error al obtener los envíos del usuario", 500);
    }
  }

  async allRoutes(): Promise<RouteDTO[]> {
    try {
      return await this.routeRepository.allRoutes();
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }
  async allTransporters(): Promise<TransporterDTO[]> {
    try {
      return await this.routeRepository.allTransporters();
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }

  async assignRouteToShipment({
    id,
    routeId,
    transporterId,
  }: AssingShipmentDTO): Promise<Result<boolean>> {
    try {
      const shipment = await this.shipmentRepository.findById(id);

      if (!shipment) {
        return Result.fail("No se encontró el envío", 404);
      }
      const transporter = await this.routeRepository.findTransporterById(
        transporterId
      );

      if (!transporter) {
        return Result.fail("El transportista ya fue asignado", 404);
      }

      const packageAllowed =
        this.validateWeightCapacityService.validateWeightCapacity(
          { weight: shipment.packageInfo.weight },
          { volumeCapacity: transporter.vehicle_capacity }
        );

      if (!packageAllowed) {
        return Result.fail(
          "El paquete excede la capacidad del transportista",
          400
        );
      }

      const route = await this.routeRepository.findAvailableRoutes();
      if (!route) {
        return Result.fail("No se encontró la ruta", 404);
      }
      const result = await this.routeRepository.assignRouteToShipment({
        id,
        routeId,
        transporterId,
      });
      if (!result) {
        return Result.fail("No se pudo asignar la ruta al envío", 400);
      }

      await this.shipmentRepository.updateStatus(id, ShipmentStatus.PROCESSING);
      emitUpdate(this.io, { message: "Orden asignada" });
      return Result.ok(result);
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
      return Result.fail("Error al obtener los envíos del usuario", 500);
    }
  }

  async getMonthlyPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    try {
      return await this.shipmentRepository.getMonthlyPerformanceMetrics(
        parameters
      );
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }
  async getRoutePerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    try {
      return await this.shipmentRepository.getRoutePerformanceMetrics(
        parameters
      );
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }

  async getTransporterPerformanceMetrics(
    parameters: Pick<Filter, "startDate" | "endDate">
  ): Promise<any> {
    try {
      return await this.shipmentRepository.getTransporterPerformanceMetrics(
        parameters
      );
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }

  async storeTransporter(
    data: Omit<
      TransporterEntity,
      "id" | "created_at" | "updated_at" | "available"
    >
  ): Promise<
    Omit<TransporterEntity, "created_at" | "updated_at" | "available">
  > {
    try {
      return await this.shipmentRepository.storeTransporter(data);
    } catch (error) {
      console.error("Error al obtener los envíos:", error);
    }
  }
}
