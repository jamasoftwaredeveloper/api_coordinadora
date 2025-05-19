import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../../config/db";
import { DatabaseError } from "../../../interfaces/errors/DatabaseError";
import { TransporterEntity } from "../../../interfaces/transporter/transporter.interface";

// Interfaces para tipar los resultados

export class TransporterModel {

}

export const transporterModel = new TransporterModel();
