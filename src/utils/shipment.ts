import { ShipmentDTO } from "../application/dto/shipment.dto";
import {
  ShipmentRow,
  ShipmentStatus,
  ShipmentWithRouteInfo,
} from "../interfaces/order/shipment.interface";
import { safeParse } from "./general";

/**
 * Mapea una fila de la BD a un DTO de envío
 */
export const mapRowToShipmentDTO = (row: ShipmentRow): ShipmentDTO => {
  return {
    id: row.id,
    userId: row.user_id,
    packageInfo: safeParse(row.package_info),
    transporterId: row.transporter_id,
    destinationAddress: safeParse(row.destination_address),
    exitAddress: safeParse(row.exit_address),
    status: row.status as ShipmentStatus,
    trackingNumber: row.tracking_number,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Mapea una fila de la BD a un DTO de envío con información de ruta
 */
export const mapRowToShipmentWithRouteInfo = (
  row: ShipmentRow
): ShipmentWithRouteInfo => {
  return {
    id: row.id,
    userId: row.user_id,
    route: row.route,
    transporter: row.transporter,
    packageInfo: safeParse(row.package_info),
    transporterId: row.transporter_id,
    destinationAddress: safeParse(row.destination_address),
    exitAddress: safeParse(row.exit_address),
    status: row.status as ShipmentStatus,
    trackingNumber: row.tracking_number,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
