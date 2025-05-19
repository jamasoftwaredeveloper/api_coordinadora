// función que retorna la conexión pool a la base de datos
import { up as createUsersTable } from "../migrations/001-create-users-table";
import { up as createShipmentsTable } from "../migrations/002-create-shipments-table";
import { up as createRoutesTable } from "../migrations/003-create-routes-table";
import { up as createTransportesTable } from "../migrations/004-create-transportes-table";
import { getDbPool } from "./db";

async function runMigrations() {
  const pool = getDbPool();

  try {
    await createUsersTable(pool);
    await createRoutesTable(pool);
    await createTransportesTable(pool);
    await createShipmentsTable(pool);
    console.log("All migrations executed successfully.");
    process.exit(0); // termina el proceso si todo va bien
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1); // termina con error
  }
}

runMigrations();
