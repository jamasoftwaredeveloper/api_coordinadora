export enum ShipmentStatus {
  PENDING = "En espera",
  PROCESSING = "En procesamiento",
  SHIPPING = "En camino",
  DELIVERED = "Entregado",
  CANCELLED = "Cancelado",
}

export interface PackageInfo {
  weight: number; // en kilogramos
  height: number; // en centímetros
  width: number; // en centímetros
  length: number; // en centímetros
  productType: string; // tipo de producto
  description?: string; // descripción opcional
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
  recipientName: string;
  recipientPhone: string;
}

export interface ShipmentEntity {
  id?: number;
  userId: number;
  packageInfo: PackageInfo;
  exitAddress: Address;
  destinationAddress: Address;
  status: ShipmentStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentRequest
  extends Pick<ShipmentEntity, "trackingNumber"> {}

export interface ShipmentUpdateStatusRequest
  extends Pick<ShipmentEntity, "id" | "status"> {}

export interface Filter {
  search: string;
  route_id?: number;
  transporter_id?: number;
  startDate?:string;
  endDate?:string;
  status?:string
}
