import {
  Address,
  PackageInfo,
  ShipmentEntity,
  ShipmentStatus,
} from "../../interfaces/order/shipment.interface";

export class Shipment implements ShipmentEntity {
  id?: number;
  userId: number;
  packageInfo: PackageInfo;
  destinationAddress: Address;
  status: ShipmentStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ShipmentEntity) {
    this.id = data.id;
    this.userId = data.userId;
    this.packageInfo = data.packageInfo;
    this.destinationAddress = data.destinationAddress;
    this.status = data.status || ShipmentStatus.PENDING;
    this.trackingNumber = data.trackingNumber;
    this.estimatedDeliveryDate = data.estimatedDeliveryDate;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Métodos de dominio
  calculateShippingCost(): number {
    // Lógica para calcular el costo basado en peso y dimensiones
    const { weight, height, width, length } = this.packageInfo;
    const volumetricWeight = (height * width * length) / 5000; // Fórmula estándar
    const chargeableWeight = Math.max(weight, volumetricWeight);

    // Tarifa base por kg (ejemplo)
    const ratePerKg = 2.5;
    return chargeableWeight * ratePerKg;
  }

  isValidAddress(): boolean {
    // Validación básica de la dirección
    const {
      street,
      city,
      state,
      postalCode,
      country,
      recipientName,
      recipientPhone,
    } = this.destinationAddress;

    if (
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !recipientName ||
      !recipientPhone
    ) {
      return false;
    }

    // Verificar que el código postal sea válido (ejemplo para Colombia)
    if (country.toLowerCase() === "colombia" && !/^\d{6}$/.test(postalCode)) {
      return false;
    }

    return true;
  }

  generateTrackingNumber(): string {
    // Generar un número de seguimiento único
    const prefix = "CO";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${prefix}${timestamp}${random}`;
  }
}
