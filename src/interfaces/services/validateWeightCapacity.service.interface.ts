export interface ShipmentPayload {
  weight: number; // Email o identificador del destinatario
}
export interface WeightCapacityPayload {
  volumeCapacity: number; // Email o identificador del destinatario
}

export interface ValidateWeightCapacityService {
  validateWeightCapacity(
    payload: ShipmentPayload,
    WeightCapacity: WeightCapacityPayload
  ): Promise<boolean>;
}
