
// src/domain/repositories/IShipmentRepository.ts

import { ShipmentDTO } from "../../application/dto/shipment.dto";
import { Filter, ShipmentStatus } from "../../interfaces/order/shipment.interface";

/**
 * Interfaz para el repositorio de envíos
 * Define el contrato que cualquier implementación de repositorio debe cumplir
 */
export interface IShipmentRepository {
  /**
   * Crea un nuevo envío
   * @param shipmentData Datos del envío a crear
   */
  create(shipmentData: ShipmentDTO): Promise<ShipmentDTO>;
  
  /**
   * Busca un envío por su ID
   * @param id ID del envío
   */
  findById(id: number): Promise<ShipmentDTO | null>;
  
  /**
   * Busca un envío por su número de seguimiento
   * @param trackingNumber Número de seguimiento
   */
  findByTrackingNumber(trackingNumber: string): Promise<ShipmentDTO | null>;
  
  /**
   * Busca envíos por ID de usuario con filtros opcionales
   * @param userId ID del usuario
   * @param parameters Parámetros de filtrado
   */
  findByUserId(userId: number, parameters: Filter): Promise<any[]>;
  
  /**
   * Actualiza el estado de un envío
   * @param id ID del envío
   * @param status Nuevo estado
   */
  updateStatus(id: number, status: ShipmentStatus): Promise<boolean>;
  
  /**
   * Elimina un envío
   * @param id ID del envío a eliminar
   */
  delete(id: number): Promise<boolean>;
  
  /**
   * Obtiene todos los envíos
   */
  findAll(): Promise<ShipmentDTO[]>;
}