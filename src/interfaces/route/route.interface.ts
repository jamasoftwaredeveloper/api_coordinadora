export interface RouteEntity {
  id: number;
  name: string;
  vehicle_capacity: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
