import { ShipmentPayload, ValidateWeightCapacityService, WeightCapacityPayload } from "../../interfaces/services/validateWeightCapacity.service.interface";


export class ValidateWeightCapacityServiceImpl
  implements ValidateWeightCapacityService
{
  async validateWeightCapacity(
    payload: ShipmentPayload,
    volumeCapacity: WeightCapacityPayload
  ): Promise<boolean> {
    try {
      if (
        payload.weight >
        volumeCapacity.volumeCapacity
      ) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al enviar el correo:", error.message);
      return false;
    }
  }
}
