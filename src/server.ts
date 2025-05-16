// const express = require("express"); //CJS CommonJS module system
import express from "express"; //ESM EcmaScript module system
import cors from "cors";
import "dotenv/config";
import router from "./infrastructure/web/routes/auth";
import { swaggerDocs } from "./swagger";
import userEntity from "./domain/auth/user.entity";
import { corsConfig } from "./infrastructure/config/cors";

const app = express();
//Cors
//Swagger
const port = parseInt(process.env.PORT || "4000", 10);
swaggerDocs(app, port);
app.use(cors(corsConfig));
(async () => {
    try {
      await userEntity.createTable();
      console.log('Tabla de usuarios inicializada');
    } catch (error) {
      console.error('Error al inicializar tabla de usuarios:', error);
    }
  })();

// routes
//Leer datos de json
app.use(express.json());
app.use("/", router);


export default app;
