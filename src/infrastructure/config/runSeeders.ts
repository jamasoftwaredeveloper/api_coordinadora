import express from "express";
import { getDbPool } from "./db";
import { runRouteSeeder } from "../seeders/route.seeder";
import { runTransporterSeeder } from "../seeders/transporter.seeder";
import { runUserSeeder } from "../seeders/user.seeder";

async function main() {
  const pool = getDbPool();

  try {
    // Ejecutar el seeder al iniciar el servidor
    await runRouteSeeder(pool);
    await runTransporterSeeder(pool);
    await runUserSeeder(pool)
    console.log("Seeders ejecutados correctamente");
  } catch (error) {
    console.error("Error ejecutando seeders:", error);
    process.exit(1);
  }

  const app = express();
  app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
}

main();
