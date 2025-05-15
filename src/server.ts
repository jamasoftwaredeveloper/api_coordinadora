// const express = require("express"); //CJS CommonJS module system
import express from "express"; //ESM EcmaScript module system
import cors from "cors";
import "dotenv/config";
import router from "./routes/auth";

import { corsConfig } from "./config/cors";
import User from "./models/User";

const app = express();
//Cors
app.use(cors(corsConfig));
(async () => {
    try {
      await User.createTable();
      console.log('Tabla de usuarios inicializada');
    } catch (error) {
      console.error('Error al inicializar tabla de usuarios:', error);
    }
  })();
//Conexión a base datos

// routes
//Leer datos de json
app.use(express.json());
app.use("/", router);

export default app;
