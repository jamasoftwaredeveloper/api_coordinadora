import { TransporterEntity } from "../../interfaces/transporter/transporter.interface";

export class Transporter implements TransporterEntity {
  id: number;
  name: string;
  vehicle_capacity: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: TransporterEntity) {
    this.id = data.id;
    this.name = data.name;
    this.vehicle_capacity = data.vehicle_capacity;
    this.available = data.available;
  }
}
