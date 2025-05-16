export interface TransporterEntity {
  id: number;
  name: string;
  available: boolean;
  vehicle_capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
