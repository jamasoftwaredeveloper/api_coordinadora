// const express = require("express"); //CJS CommonJS module system
import express from "express"; //ESM EcmaScript module system
import cors from "cors";
import "dotenv/config";
// Importar las rutas
import authRouter from "./infrastructure/web/routes/auth";
import shipmentRouter from "./infrastructure/web/routes/shipment";
import { swaggerDocs } from "./swagger";

import { corsConfig } from "./infrastructure/config/cors";
import userModel from "./infrastructure/persistence/models/user.model";
import { shipmentModel } from "./infrastructure/persistence/models/shipment.model";
import { routeModel } from "./infrastructure/persistence/models/route.model";
import { transporterModel } from "./infrastructure/persistence/models/transporter.model";

const app = express();
//Cors
//Swagger
const port = parseInt(process.env.PORT || "4000", 10);
swaggerDocs(app, port);
app.use(cors(corsConfig));
(async () => {
  try {
    console.log("Tabla de usuarios inicializada");
    await userModel.createTable();
    
    console.log("Tabla de rutas inicializada");
    await routeModel.createTable();
    
    console.log("Tabla de transporte inicializada");
    await transporterModel.createTable();
    
    console.log("Tabla de envíos inicializada");
    await shipmentModel.createTable();
  } catch (error) {
    console.error("Error al inicializar tabla de usuarios:", error);
  }
})();

// routes
//Leer datos de json
app.use(express.json());
app.use("/", authRouter);
app.use("/", shipmentRouter); // Rutas relacionadas con envíos

export default app;
