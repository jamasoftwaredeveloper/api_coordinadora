// src/domain/repositories/IRouteRepository.ts

import { AssingShipmentDTO } from "../../application/dto/shipment.dto";
import { TransporterDTO } from "../../application/dto/transporter.dto";
import { RouteRow, TransporterRow } from "../../interfaces/route/route.interface";

/**
 * Interfaz para el repositorio de rutas
 * Define el contrato que cualquier implementación de repositorio debe cumplir
 */
export interface IRouteRepository {
  /**
   * Encuentra rutas disponibles
   * @returns Lista de rutas disponibles
   */
  findAvailableRoutes(): Promise<RouteRow[]>;

  /**
   * Encuentra un transportista por su ID
   * @param transporterId ID del transportista
   * @returns Datos del transportista o null si no existe
   */
  findTransporterById(transporterId: number): Promise<TransporterDTO | null>;

  /**
   * Asigna una ruta a un envío
   * @param assignmentData Datos de asignación (id del envío, id de la ruta, id del transportista)
   * @returns Resultado de la operación
   */
  assignRouteToShipment(assignmentData: AssingShipmentDTO): Promise<boolean>;

  /**
   * Obtiene todas las rutas
   * @returns Lista completa de rutas
   */
  allRoutes(): Promise<RouteRow[]>;

  /**
   * Obtiene todos los transportistas
   * @returns Lista completa de transportistas
   */
  allTransporters(): Promise<TransporterRow[]>;
}