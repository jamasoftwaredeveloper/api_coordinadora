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
    process.exit(0); // termina el proceso si todo va bien
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1); // termina con error
  }
}

main();
