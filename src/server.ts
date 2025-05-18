import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import colors from "colors";

// Importar rutas y configuraciones
import authRouter from "./infrastructure/web/routes/auth";
import shipmentRouter from "./infrastructure/web/routes/shipment";
import { swaggerDocs } from "./swagger";
import { corsConfig } from "./infrastructure/config/cors";
import { initializeSocket } from "./infrastructure/websocket/socket";

// Modelos de base de datos
import userModel from "./infrastructure/persistence/models/user.model";
import { shipmentModel } from "./infrastructure/persistence/models/shipment.model";
import { routeModel } from "./infrastructure/persistence/models/route.model";
import { transporterModel } from "./infrastructure/persistence/models/transporter.model";

// Crear la aplicación de Express
const app = express();

// Crear el servidor HTTP y el servidor de Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

// Iniciar Socket.IO
initializeSocket(io);

// Configuración del servidor
const port = parseInt(process.env.PORT || "4000", 10);
swaggerDocs(app, port);
app.use(cors(corsConfig));
app.use(express.json());

// Inicialización de tablas en la base de datos
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
    console.error("Error al inicializar tablas:", error);
  }
})();

// Rutas
app.use("/", authRouter);
app.use("/", shipmentRouter);

export { server, io };
