import { RouteDTO } from "../../application/dto/route.dto";
import { AssingShipmentDTO } from "../../application/dto/shipment.dto";
import { TransporterDTO } from "../../application/dto/transporter.dto";

export interface RouteRepository {
  findAvailableRoutes(): Promise<RouteDTO>;
  findTransporterById(transporterId: number): Promise<TransporterDTO | null>;
  assignRouteToShipment({
    id,
    routeId,
    transporterId,
  }: AssingShipmentDTO): Promise<boolean>;
  allRoutes(): Promise<RouteDTO[]>;
  allTransporters(): Promise<TransporterDTO[]>;
}
