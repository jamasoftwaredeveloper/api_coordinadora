import { RouteEntity } from "../../interfaces/route/route.interface";

export class Route implements RouteEntity {
  id: number;
  name: string;
  vehicle_capacity: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: RouteEntity) {
    this.id = data.id;
    this.name = data.name;
    this.vehicle_capacity = data.vehicle_capacity;
    this.available = data.available;
  }
}
