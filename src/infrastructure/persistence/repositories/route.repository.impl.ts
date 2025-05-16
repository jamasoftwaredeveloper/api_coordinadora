import { Result } from "express-validator";
import { RouteDTO } from "../../../application/dto/route.dto";
import { AssingShipmentDTO } from "../../../application/dto/shipment.dto";
import { TransporterDTO } from "../../../application/dto/transporter.dto";
import { RouteRepository } from "../../../interfaces/repositories/route.repository.interface";
import { routeModel, RouteModel } from "../models/route.model";

export class RouteRepositoryImpl implements RouteRepository {
  private routeModel: RouteModel;

  constructor() {
    this.routeModel = routeModel;
  }

  async findAvailableRoutes(): Promise<RouteDTO | null> {
    const routes = await this.routeModel.findAvailableRoutes();
    return routes ? routes[0] : null; // Return the first available route or null
  }

  async findTransporterById(
    transporterId: number
  ): Promise<TransporterDTO | null> {
    return await this.routeModel.findTransporterById(transporterId);
  }

  async assignRouteToShipment(data: AssingShipmentDTO): Promise<boolean> {
    return await this.routeModel.assignRouteToShipment(data);
  }

  async allRoutes(): Promise<RouteDTO[]> {
    const routes = await this.routeModel.allRoutes();
    return routes;
  }

  async allTransporters(): Promise<TransporterDTO[] | null> {
    return await this.routeModel.allTransporters();
  }
  
}
